import { EmailSequence, Email, SequenceTemplate } from '@/types/sequence'

export const sampleSequences: EmailSequence[] = [
  {
    id: 'seq-boboli-1',
    name: 'Boboli - Logística Inteligente',
    description: 'Secuencia personalizada para Boboli enfocada en optimización de entrega y click&collect',
    target: {
      company: 'Boboli',
      contactName: 'Paulina Rabenda',
      contactTitle: 'Head of Operations',
      industry: 'Retail - Moda Infantil'
    },
    status: 'active',
    metrics: {
      sent: 3,
      opened: 3,
      clicked: 2,
      replied: 1,
      meetings: 1
    },
    emails: [
      {
        id: 'email-boboli-1',
        sequenceNumber: 1,
        subject: '¿Cómo mejorar la recogida en Boboli?',
        content: `Hola Paulina,

¿Te imaginas ofrecer a los padres una recogida ultra-rápida de la ropa de sus hijos en Boboli?

En Hapiick, hemos ayudado a gigantes como Inditex a gestionar millones de pedidos sin colas, haciendo que la experiencia de compra sea tan divertida como la ropa que vendes.

¿Te interesaría saber cómo podríamos adaptar esta solución para Boboli esta semana?`,
        sender: {
          name: 'Ian Exposito',
          title: 'Key Account Manager',
          company: 'Hapiick',
          signature: 'Intelligent Delivery Solutions'
        },
        recipient: {
          name: 'Paulina Rabenda',
          company: 'Boboli'
        },
        sentAt: new Date('2024-09-27T11:02:00'),
        status: 'opened',
        openedAt: new Date('2024-09-27T14:30:00')
      },
      {
        id: 'email-boboli-2',
        sequenceNumber: 2,
        subject: 'Innovación en Boboli: más allá de la ropa',
        content: `Hola Paulina,

Tu compromiso con la innovación en boboli es evidente.

¿Has considerado llevar esa innovación al proceso de entrega?

Nuestros terminales automatizados han revolucionado el click&collect para MediaMarkt, permitiendo recoger pedidos en segundos.

¿Qué te parece si exploramos cómo esta tecnología podría alinearse con la experiencia divertida y eficiente que Boboli ofrece a las familias?`,
        sender: {
          name: 'Ian Exposito',
          title: 'Key Account Manager',
          company: 'Hapiick',
          signature: 'Intelligent Delivery Solutions'
        },
        recipient: {
          name: 'Paulina Rabenda',
          company: 'Boboli'
        },
        sentAt: new Date('2024-10-21T11:02:00'),
        status: 'clicked',
        openedAt: new Date('2024-10-21T13:15:00'),
        clickedAt: new Date('2024-10-21T13:18:00')
      },
      {
        id: 'email-boboli-3',
        sequenceNumber: 3,
        subject: 'Crecimiento de Boboli con logística inteligente',
        content: `Hola Paulina,

Boboli ha crecido impresionantemente en 50 países. ¿El siguiente paso? Optimizar la entrega en tus más de 100 puntos de venta.

En Hapiick, nuestros sistemas robóticos han ayudado a multinacionales como Inditex a manejar 5M de paquetes sin colas, mejorando la satisfacción del cliente.

¿Te gustaría que programemos una demo para mostrar cómo podríamos impulsar aún más el crecimiento de Boboli?`,
        sender: {
          name: 'Ian Exposito',
          title: 'Key Account Manager',
          company: 'Hapiick',
          signature: 'Intelligent Delivery Solutions'
        },
        recipient: {
          name: 'Paulina Rabenda',
          company: 'Boboli'
        },
        sentAt: new Date('2024-11-15T11:02:00'),
        status: 'replied',
        openedAt: new Date('2024-11-15T11:45:00'),
        repliedAt: new Date('2024-11-15T16:30:00')
      }
    ],
    createdAt: new Date('2024-09-20T10:00:00'),
    lastSent: new Date('2024-11-15T11:02:00')
  },
  {
    id: 'seq-inditex-1',
    name: 'Inditex - Expansion Europea',
    description: 'Secuencia para expandir soluciones de automatización en centros Inditex Europa',
    target: {
      company: 'Inditex',
      contactName: 'Carlos Martínez',
      contactTitle: 'Director de Operaciones',
      industry: 'Retail - Fast Fashion'
    },
    status: 'active',
    metrics: {
      sent: 2,
      opened: 2,
      clicked: 1,
      replied: 0,
      meetings: 0
    },
    emails: [
      {
        id: 'email-inditex-1',
        sequenceNumber: 1,
        subject: 'Optimización logística para el Black Friday de Inditex',
        content: `Hola Carlos,

Con el Black Friday aproximándose, ¿está Inditex preparado para manejar el pico de entregas sin comprometer la experiencia del cliente?

Nuestra tecnología ya gestiona 5M de paquetes para grandes retailers. ¿Te interesaría ver cómo podemos optimizar vuestros procesos para esta temporada alta?`,
        sender: {
          name: 'Ian Exposito',
          title: 'Key Account Manager',
          company: 'Hapiick',
          signature: 'Intelligent Delivery Solutions'
        },
        recipient: {
          name: 'Carlos Martínez',
          company: 'Inditex'
        },
        sentAt: new Date('2024-11-01T09:00:00'),
        status: 'opened',
        openedAt: new Date('2024-11-01T10:30:00')
      },
      {
        id: 'email-inditex-2',
        sequenceNumber: 2,
        subject: 'Casos de éxito: Retail automation en temporada alta',
        content: `Hola Carlos,

Te comparto un caso de éxito reciente: ayudamos a un retailer similar a Inditex a reducir el tiempo de recogida en un 78% durante el último Black Friday.

¿Te gustaría que te mostremos los números específicos y cómo podríamos replicar estos resultados para Inditex?`,
        sender: {
          name: 'Ian Exposito',
          title: 'Key Account Manager',
          company: 'Hapiick',
          signature: 'Intelligent Delivery Solutions'
        },
        recipient: {
          name: 'Carlos Martínez',
          company: 'Inditex'
        },
        sentAt: new Date('2024-11-08T14:00:00'),
        status: 'clicked',
        openedAt: new Date('2024-11-08T15:20:00'),
        clickedAt: new Date('2024-11-08T15:25:00')
      }
    ],
    createdAt: new Date('2024-10-25T09:00:00'),
    lastSent: new Date('2024-11-08T14:00:00')
  }
]

export const sequenceTemplates: SequenceTemplate[] = [
  {
    id: 'template-retail',
    name: 'Retail - Optimización Logística',
    description: 'Secuencia especializada para retailers que buscan mejorar sus procesos de entrega',
    industry: 'Retail',
    emailCount: 4,
    avgResponse: 28,
    tags: ['logística', 'automatización', 'click&collect']
  },
  {
    id: 'template-ecommerce',
    name: 'E-commerce - Fulfillment Inteligente',
    description: 'Enfoque en soluciones de fulfillment para tiendas online',
    industry: 'E-commerce',
    emailCount: 3,
    avgResponse: 34,
    tags: ['fulfillment', 'automatización', 'escalabilidad']
  },
  {
    id: 'template-pharma',
    name: 'Farmacéutico - Entrega Segura',
    description: 'Soluciones de entrega especializada para el sector farmacéutico',
    industry: 'Farmacéutico',
    emailCount: 5,
    avgResponse: 22,
    tags: ['seguridad', 'compliance', 'trazabilidad']
  }
] 