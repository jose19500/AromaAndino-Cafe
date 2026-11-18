import { HttpClient } from '@angular/common/http';
import {
  Component, computed, inject, signal, type OnInit, type WritableSignal,
} from '@angular/core';
import { FormsModule, type NgForm } from '@angular/forms';
import { finalize } from 'rxjs';

interface Cafeteria {
  nombre: string;
  ciudad: string;
  direccion: string;
  telefono: string | null;
  horario: string;
  historia: string;
}

interface Servicio {
  id: number;
  nombre: string;
  descripcion: string;
}

interface Producto extends Servicio {
  categoria: string;
  precio: string;
  especialidad: 0 | 1;
  imagen: string | null;
}

interface Multimedia {
  id: number;
  tipo: 'video' | 'foto';
  titulo: string;
  descripcion: string;
  url: string;
  poster: string | null;
  fuente_url: string;
}

interface MensajeChat {
  autor: 'Tú' | 'Don Grano IA';
  texto: string;
  hora: string;
}

@Component({
  selector: 'app-root',
  imports: [FormsModule],
  templateUrl: './app.html',
})
export class App implements OnInit {
  private readonly http = inject(HttpClient);

  readonly cafeteria = signal<Cafeteria | null>(null);
  readonly servicios = signal<Servicio[]>([]);
  readonly productos = signal<Producto[]>([]);
  readonly multimedia = signal<Multimedia[]>([]);
  readonly errores = signal<string[]>([]);

  readonly categoriaActiva = signal<string>('Todos');
  readonly busquedaMenu = signal<string>('');

  readonly categorias = computed(() => {
    const unicas = new Set(this.productos().map((p) => p.categoria || 'Cafés Calientes'));
    return ['Todos', ...Array.from(unicas)];
  });

  readonly productosFiltrados = computed(() => {
    const cat = this.categoriaActiva();
    const termino = this.busquedaMenu().trim().toLowerCase();
    return this.productos().filter((producto) => {
      const coincideCat = cat === 'Todos' || producto.categoria === cat;
      const coincideTexto =
        !termino ||
        producto.nombre.toLowerCase().includes(termino) ||
        producto.descripcion.toLowerCase().includes(termino) ||
        producto.categoria.toLowerCase().includes(termino);
      return coincideCat && coincideTexto;
    });
  });

  readonly portada = computed(() => this.multimedia().find((medio) => medio.tipo === 'video'));
  readonly fotos = computed(() => this.multimedia().filter((medio) => medio.tipo === 'foto'));
  readonly especialidades = computed(() =>
    this.productos().filter((producto) => producto.especialidad === 1),
  );

  readonly etapasProceso = [
    {
      paso: '01',
      titulo: 'Cosecha de Altura (1.650 msnm)',
      detalle: 'Seleccionamos microlotes 100% arábica cultivados bajo sombra en Caranavi y los Yungas.',
    },
    {
      paso: '02',
      titulo: 'Tueste Artesanal Semanal',
      detalle: 'Tostamos en lotes pequeños cada semana para resaltar notas de cacao, panela y cítricos.',
    },
    {
      paso: '03',
      titulo: 'Molienda al Instante',
      detalle: 'Molemos cada dosis segundos antes de extraer para conservar todos los aceites esenciales.',
    },
    {
      paso: '04',
      titulo: 'Extracción de Barista',
      detalle: 'Calibramos temperatura, presión y tiempo en máquina de espresso o métodos de filtrado.',
    },
  ];

  readonly testimonios = [
    {
      nombre: 'Valeria Céspedes',
      rol: 'Diseñadora & Cliente Frecuente',
      comentario: 'El Cold Brew Cítrico & Miel y el ambiente de coworking son insuperables en Cochabamba. El internet es rapidísimo.',
      estrellas: '★★★★★',
    },
    {
      nombre: 'Mauricio Hinojosa',
      rol: 'Catador de Café',
      comentario: 'Se nota el tueste fresco en cada taza. El Mocaccino con cacao al 70% y el croissant recién salido del horno son mis favoritos.',
      estrellas: '★★★★★',
    },
    {
      nombre: 'Andrea Villarroel',
      rol: 'Arquitecta',
      comentario: 'La atención de los baristas en la barra de filtrados V60 y Chemex convierte tomar café en toda una experiencia.',
      estrellas: '★★★★★',
    },
  ];

  readonly reproducirAuto = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  readonly videoEnMarcha = signal(false);

  readonly enviandoContacto = signal(false);
  readonly estadoContacto = signal('');

  readonly chatAbierto = signal(false);
  readonly esperandoChat = signal(false);
  readonly errorChat = signal('');
  readonly chat = signal<MensajeChat[]>([
    {
      autor: 'Don Grano IA',
      texto: '¡Bienvenido a Aroma Andino Café! Soy Don Grano IA, tu barista virtual impulsado por Ollama + Gemma 3. ¿Deseas conocer nuestras especialidades, el menú del local, precios u horarios?',
      hora: this.obtenerHora(),
    },
  ]);

  ngOnInit(): void {
    this.cargar('cafeteria', this.cafeteria, 'los datos de la cafetería');
    this.cargar('servicios', this.servicios, 'los servicios');
    this.cargar('productos', this.productos, 'el menú');
    this.cargar('multimedia', this.multimedia, 'el video y las fotos');
  }

  private obtenerHora(): string {
    return new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' });
  }

  private cargar<T>(ruta: string, destino: WritableSignal<T>, etiqueta: string): void {
    this.http.get<T>(`/api/${ruta}`).subscribe({
      next: (datos) => destino.set(datos),
      error: () => this.errores.update((lista) => [...lista, `No se pudo cargar ${etiqueta}.`]),
    });
  }

  seleccionarCategoria(categoria: string): void {
    this.categoriaActiva.set(categoria);
  }

  iniciarVideo(video: HTMLVideoElement): void {
    video.muted = true;
    if (this.reproducirAuto && video.paused) {
      void video.play().catch(() => this.videoEnMarcha.set(false));
    }
  }

  alternarVideo(video: HTMLVideoElement): void {
    video.muted = true;
    if (video.paused) {
      void video.play().catch(() => this.videoEnMarcha.set(false));
    } else {
      video.pause();
    }
  }

  alternarChat(): void {
    this.chatAbierto.update((abierto) => !abierto);
  }

  limpiarChat(): void {
    this.chat.set([
      {
        autor: 'Don Grano IA',
        texto: 'Historial reiniciado. ¡Pregúntame sobre cualquier café, postre, servicio o precio de Aroma Andino Café!',
        hora: this.obtenerHora(),
      },
    ]);
    this.errorChat.set('');
  }

  consultarProductoIA(producto: Producto): void {
    this.chatAbierto.set(true);
    this.enviarTextoChat(`Cuéntame sobre "${producto.nombre}", sus ingredientes, precio y con qué otro producto del menú me recomiendas acompañarlo.`);
  }

  preguntaRapida(texto: string): void {
    this.chatAbierto.set(true);
    this.enviarTextoChat(texto);
  }

  enviarContacto(formulario: NgForm): void {
    if (formulario.invalid || this.enviandoContacto()) return;

    this.estadoContacto.set('');
    this.enviandoContacto.set(true);

    this.http.post<{ mensaje: string }>('/api/contactos', formulario.value)
      .pipe(finalize(() => this.enviandoContacto.set(false)))
      .subscribe({
        next: (datos) => {
          this.estadoContacto.set(datos.mensaje);
          formulario.resetForm();
        },
        error: (respuesta) => {
          this.estadoContacto.set(respuesta.error?.error || 'No se pudo enviar el mensaje.');
        },
      });
  }

  enviarPregunta(formulario: NgForm): void {
    const prompt = String(formulario.value.pregunta ?? '').trim();
    if (!prompt || formulario.invalid || this.esperandoChat()) return;
    formulario.resetForm();
    this.enviarTextoChat(prompt);
  }

  private enviarTextoChat(prompt: string): void {
    if (!prompt || this.esperandoChat()) return;

    this.chat.update((mensajes) => [
      ...mensajes,
      { autor: 'Tú', texto: prompt, hora: this.obtenerHora() },
    ]);
    this.errorChat.set('');
    this.esperandoChat.set(true);

    this.http.post<{ response: string }>('/api/chatbot', { prompt })
      .pipe(finalize(() => this.esperandoChat.set(false)))
      .subscribe({
        next: (datos) =>
          this.chat.update((mensajes) => [
            ...mensajes,
            { autor: 'Don Grano IA', texto: datos.response, hora: this.obtenerHora() },
          ]),
        error: (respuesta) => {
          this.errorChat.set(respuesta.error?.error || 'No se pudo consultar a Don Grano IA.');
        },
      });
  }
}
