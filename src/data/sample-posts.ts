import { LinkedInPost, LinkedInComment } from '@/types/post'

// Avatar URLs para los usuarios de ejemplo - Imágenes profesionales reales
const avatars = {
  hapiick: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=128&h=128&fit=crop&crop=face',
  ceo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop&crop=face',
  cto: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=128&h=128&fit=crop&crop=face',
  lead1: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face',
  lead2: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128&h=128&fit=crop&crop=face',
  lead3: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=128&h=128&fit=crop&crop=face',
  industry1: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=128&h=128&fit=crop&crop=face',
  industry2: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=128&h=128&fit=crop&crop=face',
}

export const samplePosts: LinkedInPost[] = [
  {
    id: '1',
    author: {
      name: 'Hapiick',
      title: 'Automatización Logística Inteligente',
      avatar: avatars.hapiick,
      company: 'Hapiick',
      verified: true,
    },
    content: `🚀 ¿Sabías que el 78% de las empresas de e-commerce perdieron ventas por problemas en la entrega?

En Hapiick, hemos desarrollado una solución que revoluciona el Click & Collect:

✅ Automatización completa del proceso de recogida
✅ Integración con sistemas existentes en 48 horas
✅ Reducción del 85% en errores de entrega
✅ Ahorro promedio de 40% en costos operativos

Nuestros clientes han visto resultados increíbles:
📈 +300% eficiencia en fulfillment
🎯 99.2% satisfacción del cliente
⚡ Tiempos de procesamiento reducidos en 70%

¿Quieres saber cómo podemos transformar tu operación logística?

#LogisticaInteligente #ClickAndCollect #Automatizacion #Ecommerce #Innovation`,
    images: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop',
    ],
    createdAt: new Date('2024-01-15T10:30:00Z'),
    metrics: {
      likes: 2847,
      comments: 156,
      shares: 89,
      views: 45230,
    },
    engagement: {
      rate: 6.8,
      level: 'high',
    },
    tags: ['LogisticaInteligente', 'ClickAndCollect', 'Automatizacion', 'Ecommerce', 'Innovation'],
    type: 'image',
    isSponsored: false,
  },
  {
    id: '2',
    author: {
      name: 'Juan Rodríguez',
      title: 'CEO en Hapiick',
      avatar: avatars.ceo,
      company: 'Hapiick',
      verified: true,
    },
    content: `Reflexión del lunes: La logística ya no es solo mover cajas de A a B.

Hoy es sobre crear experiencias excepcionales que conecten marcas con clientes.

En los últimos 6 meses, hemos ayudado a más de 50 empresas a transformar su:
• Gestión de inventario
• Procesos de fulfillment
• Experiencia del cliente
• Operaciones de última milla

El resultado: Un promedio de 420% ROI en el primer año.

¿Cuál es tu mayor desafío logístico actualmente?

#Logistica #Transformacion #ROI #CustomerExperience #Leadership`,
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
    ],
    createdAt: new Date('2024-01-14T08:15:00Z'),
    metrics: {
      likes: 1256,
      comments: 78,
      shares: 45,
      views: 23450,
    },
    engagement: {
      rate: 5.9,
      level: 'high',
    },
    tags: ['Logistica', 'Transformacion', 'ROI', 'CustomerExperience', 'Leadership'],
    type: 'image',
    isSponsored: false,
  },
  {
    id: '3',
    author: {
      name: 'Hapiick',
      title: 'Automatización Logística Inteligente',
      avatar: avatars.hapiick,
      company: 'Hapiick',
      verified: true,
    },
    content: `🎯 CASO DE ÉXITO: Cómo una cadena retail aumentó sus ventas 45% en 3 meses

Nuestro cliente enfrentaba:
❌ Inventario desorganizado
❌ Errores en pedidos online
❌ Tiempos de espera excesivos
❌ Clientes insatisfechos

Implementamos nuestra solución de Click & Collect inteligente:

🔧 Automatización completa del workflow
📊 Dashboard en tiempo real
🤖 IA para optimización de rutas
📱 App móvil para staff

RESULTADOS en 90 días:
📈 +45% ventas online
⚡ -70% tiempo de procesamiento
😊 +92% satisfacción del cliente
💰 -40% costos operativos

¿Quieres una demo gratuita? Comenta "DEMO" 👇

#CasoDeExito #RetailTech #ClickAndCollect #Automatizacion #Results`,
    images: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop',
    ],
    createdAt: new Date('2024-01-13T14:20:00Z'),
    metrics: {
      likes: 3421,
      comments: 234,
      shares: 156,
      views: 67890,
    },
    engagement: {
      rate: 5.6,
      level: 'high',
    },
    tags: ['CasoDeExito', 'RetailTech', 'ClickAndCollect', 'Automatizacion', 'Results'],
    type: 'image',
    isSponsored: true,
  },
  {
    id: '4',
    author: {
      name: 'María Silva',
      title: 'CTO en Hapiick',
      avatar: avatars.cto,
      company: 'Hapiick',
      verified: true,
    },
    content: `La tecnología detrás de Hapiick 🧠

Muchos me preguntan qué hace única nuestra plataforma. Aquí van algunos insights técnicos:

🔮 Machine Learning para predicción de demanda
📊 Análisis en tiempo real con procesamiento de 10M+ eventos/día
🔄 APIs RESTful para integración en menos de 2 horas
☁️ Arquitectura cloud-native con 99.9% uptime
🔒 Seguridad enterprise con cifrado end-to-end

El stack:
• Frontend: React + TypeScript
• Backend: Node.js + Python
• Database: PostgreSQL + Redis
• Cloud: AWS + Docker + Kubernetes
• AI/ML: TensorFlow + scikit-learn

¿Te interesa conocer más detalles técnicos?

#TechStack #MachineLearning #CloudNative #API #DevOps #AI`,
    images: [
      'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop',
    ],
    createdAt: new Date('2024-01-12T16:45:00Z'),
    metrics: {
      likes: 892,
      comments: 67,
      shares: 34,
      views: 15670,
    },
    engagement: {
      rate: 6.3,
      level: 'high',
    },
    tags: ['TechStack', 'MachineLearning', 'CloudNative', 'API', 'DevOps', 'AI'],
    type: 'image',
    isSponsored: false,
  },
  {
    id: '5',
    author: {
      name: 'Hapiick',
      title: 'Automatización Logística Inteligente',
      avatar: avatars.hapiick,
      company: 'Hapiick',
      verified: true,
    },
    content: `🔥 WEBINAR GRATUITO: "El Futuro del Click & Collect"

📅 Próximo martes 23 de enero
🕐 11:00 AM (CET)
⏱️ Duración: 45 minutos + Q&A

📋 Agenda:
• Tendencias 2024 en logística omnicanal
• Casos reales de transformación digital
• Demo live de nuestra plataforma
• Calculadora de ROI personalizada
• Sesión de preguntas y respuestas

🎁 BONUS para asistentes:
✅ Audit gratuito de tu operación actual
✅ Plantilla de optimización logística
✅ Consulta estratégica 1-a-1 (30 min)

👥 Speakers:
• Juan Rodríguez (CEO)
• María Silva (CTO)
• Carlos Mendoza (Dir. Operaciones)

¿Te apuntas? Link en comentarios 👇

#WebinarGratuito #ClickAndCollect #LogisticaDigital #Transformacion #ROI`,
    images: [
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=600&fit=crop',
    ],
    createdAt: new Date('2024-01-11T09:30:00Z'),
    metrics: {
      likes: 1876,
      comments: 145,
      shares: 98,
      views: 34560,
    },
    engagement: {
      rate: 6.1,
      level: 'high',
    },
    tags: ['WebinarGratuito', 'ClickAndCollect', 'LogisticaDigital', 'Transformacion', 'ROI'],
    type: 'image',
    isSponsored: true,
  },
]

export const sampleComments: LinkedInComment[] = [
  {
    id: 'c1',
    author: {
      name: 'Carlos Pérez',
      title: 'Director de Operaciones',
      avatar: avatars.lead1,
      company: 'MegaRetail SA',
    },
    content: 'Increíble los resultados! Nosotros tenemos problemas similares. ¿Podrían contactarme para más información?',
    createdAt: new Date('2024-01-15T11:15:00Z'),
    likes: 23,
  },
  {
    id: 'c2',
    author: {
      name: 'Ana López',
      title: 'Gerente de E-commerce',
      avatar: avatars.lead2,
      company: 'Fashion Forward',
    },
    content: 'DEMO - Me interesa mucho conocer más sobre la implementación',
    createdAt: new Date('2024-01-13T15:30:00Z'),
    likes: 34,
  },
  {
    id: 'c3',
    author: {
      name: 'Roberto Martín',
      title: 'CEO',
      avatar: avatars.lead3,
      company: 'TechLogistics',
    },
    content: 'Excelente caso de uso. La automatización es clave para el futuro del retail. ¿Tienen casos en el sector B2B?',
    createdAt: new Date('2024-01-13T16:45:00Z'),
    likes: 18,
  },
  {
    id: 'c4',
    author: {
      name: 'Luis Morales',
      title: 'Supply Chain Manager',
      avatar: avatars.industry1,
      company: 'Global Logistics',
    },
    content: 'Muy interesante el stack tecnológico. ¿Cómo manejan la escalabilidad en picos de demanda?',
    createdAt: new Date('2024-01-12T17:20:00Z'),
    likes: 12,
  },
  {
    id: 'c5',
    author: {
      name: 'Sandra García',
      title: 'Digital Transformation Lead',
      avatar: avatars.industry2,
      company: 'InnovateCorp',
    },
    content: 'Me apunto al webinar! Necesitamos urgentemente optimizar nuestros procesos de fulfillment.',
    createdAt: new Date('2024-01-11T10:45:00Z'),
    likes: 28,
  },
]

// Función para generar posts adicionales
export function generateRandomPost(): LinkedInPost {
  const authors = [
    {
      name: 'Hapiick',
      title: 'Automatización Logística Inteligente',
      avatar: avatars.hapiick,
      company: 'Hapiick',
      verified: true,
    },
    {
      name: 'Juan Rodríguez',
      title: 'CEO en Hapiick',
      avatar: avatars.ceo,
      company: 'Hapiick',
      verified: true,
    },
    {
      name: 'María Silva',
      title: 'CTO en Hapiick',
      avatar: avatars.cto,
      company: 'Hapiick',
      verified: true,
    },
  ]

  const contents = [
    '🚀 La revolución del retail está aquí. ¿Está tu empresa preparada?',
    '💡 Tip del día: La automatización no reemplaza a las personas, las potencia.',
    '📊 Datos que sorprenden: El 89% de retailers planea invertir en automatización este año.',
    '🎯 Enfoque en el cliente: Cada touchpoint cuenta en la experiencia omnicanal.',
    '⚡ Velocidad + Precisión = Clientes satisfechos. Es así de simple.',
  ]

  const randomAuthor = authors[Math.floor(Math.random() * authors.length)]
  const randomContent = contents[Math.floor(Math.random() * contents.length)]
  const randomLikes = Math.floor(Math.random() * 5000) + 100
  const randomComments = Math.floor(Math.random() * 200) + 10
  const randomShares = Math.floor(Math.random() * 100) + 5
  const randomViews = Math.floor(Math.random() * 50000) + 1000

  return {
    id: `generated-${Date.now()}`,
    author: randomAuthor,
    content: randomContent,
    createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    metrics: {
      likes: randomLikes,
      comments: randomComments,
      shares: randomShares,
      views: randomViews,
    },
    engagement: {
      rate: ((randomLikes + randomComments + randomShares) / randomViews) * 100,
      level: Math.random() > 0.5 ? 'high' : 'medium',
    },
    type: 'text',
    isSponsored: Math.random() > 0.7,
  }
} 