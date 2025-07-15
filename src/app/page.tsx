'use client'

import { useState, useEffect } from 'react'
import { ChevronRight, Play, BarChart3, Users, MessageSquare, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentMetric, setCurrentMetric] = useState(0)

  useEffect(() => {
    setIsLoaded(true)
    const interval = setInterval(() => {
      setCurrentMetric((prev) => (prev + 1) % 4)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const metrics = [
    { value: '85%', label: 'Aumento en engagement', color: 'text-success-600' },
    { value: '3.2x', label: 'Más leads cualificados', color: 'text-linkedin-600' },
    { value: '45%', label: 'Reducción en costos', color: 'text-accent-600' },
    { value: '92%', label: 'Satisfacción del cliente', color: 'text-warning-600' }
  ]

  const features = [
    {
      icon: <BarChart3 className="w-8 h-8 text-linkedin-500" />,
      title: 'Analytics Avanzados',
      description: 'Métricas detalladas de engagement, alcance y conversión para optimizar tu estrategia.'
    },
    {
      icon: <Users className="w-8 h-8 text-success-500" />,
      title: 'Lead Scoring',
      description: 'Sistema inteligente que califica y prioriza leads basado en comportamiento y engagement.'
    },
    {
      icon: <MessageSquare className="w-8 h-8 text-accent-500" />,
      title: 'Conversaciones Automatizadas',
      description: 'Simulación de conversaciones naturales que convierten visitantes en clientes.'
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-warning-500" />,
      title: 'Optimización Continua',
      description: 'Algoritmos que aprenden y mejoran automáticamente el rendimiento de tus campañas.'
    }
  ]

  const benefits = [
    'Aumento del 300% en leads cualificados',
    'Reducción del 60% en tiempo de gestión',
    'Mejora del 85% en tasa de conversión',
    'ROI promedio del 420% en 6 meses'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="linkedin-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-linkedin-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Simplificando → Hapiick</span>
            </div>
            <nav className="hidden md:flex space-x-6">
              <Link href="#demo" className="linkedin-nav font-medium">
                Demo
              </Link>
              <Link href="#features" className="linkedin-nav font-medium">
                Características
              </Link>
              <Link href="#results" className="linkedin-nav font-medium">
                Resultados
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <Link 
              href="/dashboard" 
              className="linkedin-button-secondary"
            >
              Ver Demo
            </Link>
            <Link 
              href="/dashboard" 
              className="linkedin-button"
            >
              Empezar Ahora
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Transforma tu
                <span className="text-linkedin-500"> LinkedIn</span>
                <br />
                en una máquina de
                <span className="text-success-500"> leads</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                Descubre cómo Hapiick puede revolucionar tu estrategia de contenidos en LinkedIn 
                y generar leads cualificados de forma automática.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  href="/dashboard" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-linkedin-500 text-white rounded-lg font-semibold hover:bg-linkedin-600 transition-colors duration-200"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Ver Demo Interactivo
                </Link>
                <Link 
                  href="#features" 
                  className="inline-flex items-center justify-center px-8 py-4 bg-transparent text-linkedin-500 border-2 border-linkedin-500 rounded-lg font-semibold hover:bg-linkedin-50 transition-colors duration-200"
                >
                  Conocer Más
                  <ChevronRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {metrics.map((metric, index) => (
              <div 
                key={index}
                className={`text-center p-6 linkedin-card transition-all duration-500 ${
                  index === currentMetric ? 'ring-2 ring-linkedin-200 scale-105' : ''
                } ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`text-3xl font-bold ${metric.color} mb-2`}>
                  {metric.value}
                </div>
                <div className="text-sm text-gray-600">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Características Principales
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Herramientas avanzadas diseñadas específicamente para maximizar tu presencia en LinkedIn
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="linkedin-card linkedin-card-hover p-6 text-center fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section id="results" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Resultados que Hablan por Sí Solos
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Nuestros clientes han experimentado transformaciones dramáticas en sus 
                estrategias de LinkedIn, generando más leads y mejores conversiones.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-success-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="linkedin-card p-8">
              <div className="text-center">
                <div className="text-6xl font-bold text-linkedin-500 mb-4">
                  420%
                </div>
                <div className="text-xl text-gray-900 mb-2">
                  ROI Promedio
                </div>
                <div className="text-gray-600 mb-6">
                  en los primeros 6 meses
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">
                    "Hapiick transformó completamente nuestra estrategia de LinkedIn. 
                    Los resultados superaron nuestras expectativas."
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    - CEO, TechCorp
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-linkedin-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            ¿Listo para Revolucionar tu LinkedIn?
          </h2>
          <p className="text-xl text-linkedin-100 mb-8">
            Únete a cientos de empresas que ya están transformando sus resultados
          </p>
          <Link 
            href="/dashboard" 
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-linkedin-500 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
          >
            Ver Demo Completo
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-linkedin-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="text-xl font-bold text-white">Hapiick</span>
          </div>
          <p className="text-gray-400">
            © 2024 Hapiick. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
} 