#!/usr/bin/env python3
"""
🎯 Dashboard Profesional de Outbound Marketing
===================================================
Dashboard ejecutivo para gestión y análisis de campañas de outbound
Diseñado desde la perspectiva de un experto en outbound marketing
"""

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
import os
import sys
from pathlib import Path
from datetime import datetime, date, timedelta
from dotenv import load_dotenv
import logging
import numpy as np
from typing import Dict, List, Optional, Tuple
from database_connection import test_connection, execute_query, execute_query_list

# Configurar página
st.set_page_config(
    page_title="🎯 Outbound Marketing Dashboard",
    page_icon="🎯",
    layout="wide",
    initial_sidebar_state="expanded",
    menu_items={
        'About': "Dashboard profesional para gestión de campañas de outbound marketing"
    }
)

# CSS profesional mejorado
def load_professional_css():
    st.markdown("""
    <style>
    /* Tema principal mejorado */
    .stApp {
        background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    /* Sidebar personalizado */
    .css-1d391kg {
        background: linear-gradient(180deg, #1e3c72 0%, #2a5298 100%);
    }
    
    /* Métricas cards mejoradas */
    .metric-card {
        background: rgba(255, 255, 255, 0.95);
        padding: 20px;
        border-radius: 15px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        margin-bottom: 15px;
        transition: all 0.3s ease;
    }
    
    .metric-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
    }
    
    .metric-value {
        font-size: 2.5rem;
        font-weight: 700;
        color: #1e3c72;
        margin: 0;
        line-height: 1.2;
    }
    
    .metric-label {
        font-size: 0.9rem;
        color: #666;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-top: 5px;
    }
    
    .metric-change {
        font-size: 0.8rem;
        margin-top: 5px;
        font-weight: 600;
    }
    
    .metric-positive { color: #28a745; }
    .metric-negative { color: #dc3545; }
    .metric-neutral { color: #6c757d; }
    
    /* Secciones del dashboard */
    .dashboard-section {
        background: rgba(255, 255, 255, 0.95);
        padding: 25px;
        border-radius: 15px;
        margin-bottom: 25px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    }
    
    .section-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: #1e3c72;
        margin-bottom: 20px;
        border-bottom: 2px solid #e9ecef;
        padding-bottom: 10px;
    }
    
    /* Filtros mejorados */
    .filter-container {
        background: rgba(255, 255, 255, 0.9);
        padding: 20px;
        border-radius: 15px;
        margin-bottom: 20px;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    /* Botones mejorados */
    .stButton > button {
        background: linear-gradient(45deg, #1e3c72, #2a5298);
        color: white;
        border: none;
        border-radius: 10px;
        padding: 12px 24px;
        font-weight: 600;
        font-size: 0.9rem;
        transition: all 0.3s ease;
        box-shadow: 0 4px 15px rgba(30, 60, 114, 0.3);
    }
    
    .stButton > button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(30, 60, 114, 0.4);
    }
    
    /* Tablas mejoradas */
    .dataframe {
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
    
    /* Alertas y indicadores mejorados */
    .alert-success {
        background: rgba(40, 167, 69, 0.15);
        border: 2px solid rgba(40, 167, 69, 0.4);
        color: #0d5016;
        padding: 20px;
        border-radius: 12px;
        margin: 15px 0;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(40, 167, 69, 0.1);
        border-left: 5px solid #28a745;
    }
    
    .alert-warning {
        background: rgba(255, 193, 7, 0.15);
        border: 2px solid rgba(255, 193, 7, 0.4);
        color: #533f03;
        padding: 20px;
        border-radius: 12px;
        margin: 15px 0;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(255, 193, 7, 0.1);
        border-left: 5px solid #ffc107;
    }
    
    .alert-danger {
        background: rgba(220, 53, 69, 0.15);
        border: 2px solid rgba(220, 53, 69, 0.4);
        color: #3d0a0f;
        padding: 20px;
        border-radius: 12px;
        margin: 15px 0;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(220, 53, 69, 0.1);
        border-left: 5px solid #dc3545;
    }
    
    /* Indicadores de estado */
    .status-indicator {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-right: 8px;
    }
    
    .status-active { background-color: #28a745; }
    .status-warning { background-color: #ffc107; }
    .status-danger { background-color: #dc3545; }
    
    /* Estilos mejorados para la vista jerárquica */
    .hierarchy-section {
        background: rgba(255, 255, 255, 0.98);
        border-radius: 15px;
        padding: 25px;
        margin: 20px 0;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .hierarchy-title {
        font-size: 1.8rem;
        font-weight: 700;
        color: #1e3c72;
        margin-bottom: 25px;
        text-align: center;
        border-bottom: 3px solid #e9ecef;
        padding-bottom: 15px;
    }
    
    /* Estilos para tabs mejorados */
    .stTabs [data-baseweb="tab-list"] {
        gap: 10px;
        background: rgba(30, 60, 114, 0.05);
        border-radius: 12px;
        padding: 5px;
        margin-bottom: 20px;
    }
    
    .stTabs [data-baseweb="tab"] {
        background: rgba(255, 255, 255, 0.8);
        border-radius: 8px;
        padding: 12px 20px;
        font-weight: 600;
        border: 1px solid rgba(30, 60, 114, 0.2);
        transition: all 0.3s ease;
    }
    
    .stTabs [data-baseweb="tab"]:hover {
        background: rgba(30, 60, 114, 0.1);
        border-color: #1e3c72;
        transform: translateY(-2px);
    }
    
    .stTabs [aria-selected="true"] {
        background: linear-gradient(135deg, #1e3c72, #2a5298);
        color: white !important;
        border-color: #1e3c72;
        box-shadow: 0 4px 15px rgba(30, 60, 114, 0.3);
    }
    
    /* Contenedor de resumen general */
    .summary-container {
        background: linear-gradient(135deg, #f8f9fa, #e9ecef);
        border-radius: 12px;
        padding: 20px;
        margin: 20px 0;
        border: 1px solid rgba(30, 60, 114, 0.1);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
    }
    
    .summary-title {
        font-size: 1.3rem;
        font-weight: 600;
        color: #1e3c72;
        margin-bottom: 15px;
        text-align: center;
        padding: 10px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 8px;
        border: 1px solid rgba(30, 60, 114, 0.1);
    }
    
    /* Métricas mejoradas */
    .metric-enhanced {
        background: rgba(255, 255, 255, 0.95);
        padding: 15px;
        border-radius: 12px;
        text-align: center;
        border: 1px solid rgba(0, 0, 0, 0.05);
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
        transition: all 0.3s ease;
        margin: 5px;
    }
    
    .metric-enhanced:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 25px rgba(0, 0, 0, 0.12);
        border-color: #1e3c72;
    }
    
    .metric-enhanced .metric-value {
        font-size: 1.8rem;
        font-weight: 800;
        color: #1e3c72;
        margin-bottom: 5px;
    }
    
    .metric-enhanced .metric-label {
        font-size: 0.85rem;
        color: #666;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }
    
    /* Selectbox mejorado */
    .stSelectbox > div > div {
        background: rgba(255, 255, 255, 0.95);
        border: 2px solid rgba(30, 60, 114, 0.2);
        border-radius: 8px;
        padding: 8px;
        transition: all 0.3s ease;
    }
    
    .stSelectbox > div > div:hover {
        border-color: #1e3c72;
        box-shadow: 0 4px 15px rgba(30, 60, 114, 0.1);
    }
    
    /* Expanders mejorados */
    .streamlit-expanderHeader {
        background: rgba(255, 255, 255, 0.95) !important;
        border: 1px solid rgba(30, 60, 114, 0.15) !important;
        border-radius: 10px !important;
        padding: 12px 15px !important;
        margin: 8px 0 !important;
        font-weight: 600 !important;
        color: #1e3c72 !important;
        transition: all 0.3s ease !important;
    }
    
    .streamlit-expanderHeader:hover {
        background: rgba(30, 60, 114, 0.05) !important;
        border-color: #1e3c72 !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 15px rgba(30, 60, 114, 0.1) !important;
    }
    
    .streamlit-expanderContent {
        background: rgba(255, 255, 255, 0.98) !important;
        border: 1px solid rgba(30, 60, 114, 0.1) !important;
        border-radius: 0 0 10px 10px !important;
        padding: 20px !important;
        margin-top: -1px !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
    }
    
    /* Divisores visuales */
    .visual-divider {
        height: 3px;
        background: linear-gradient(90deg, #1e3c72, #2a5298, #1e3c72);
        border-radius: 2px;
        margin: 20px 0;
        opacity: 0.3;
    }
    
    /* Indicadores de rendimiento */
    .performance-indicator {
        display: inline-flex;
        align-items: center;
        gap: 5px;
        padding: 4px 8px;
        border-radius: 15px;
        font-size: 0.8rem;
        font-weight: 600;
        margin-left: 10px;
    }
    
    .performance-good {
        background: rgba(40, 167, 69, 0.1);
        color: #28a745;
        border: 1px solid rgba(40, 167, 69, 0.3);
    }
    
    .performance-warning {
        background: rgba(255, 193, 7, 0.1);
        color: #ffc107;
        border: 1px solid rgba(255, 193, 7, 0.3);
    }
    
    .performance-danger {
        background: rgba(220, 53, 69, 0.1);
        color: #dc3545;
        border: 1px solid rgba(220, 53, 69, 0.3);
    }
    
    /* Información contextual */
    .context-info {
        background: rgba(23, 162, 184, 0.1);
        border: 1px solid rgba(23, 162, 184, 0.3);
        border-radius: 8px;
        padding: 12px;
        margin: 15px 0;
        color: #17a2b8;
        font-weight: 500;
    }
    
    /* Contenedor de actividades */
    .activities-container {
        background: rgba(248, 249, 250, 0.8);
        border-radius: 10px;
        padding: 15px;
        margin: 15px 0;
        border: 1px solid rgba(0, 0, 0, 0.05);
    }
    
    .activities-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: #1e3c72;
        margin-bottom: 15px;
        padding-bottom: 8px;
        border-bottom: 2px solid rgba(30, 60, 114, 0.1);
    }
    
    /* Responsive */
    @media (max-width: 768px) {
        .metric-value { font-size: 1.8rem; }
        .section-title { font-size: 1.2rem; }
        .hierarchy-metrics { flex-direction: column; }
    }
    </style>
    """, unsafe_allow_html=True)

# Cargar configuración
load_dotenv()

# Funciones de datos optimizadas
@st.cache_data(ttl=300)
def obtener_clientes_disponibles():
    """Obtiene lista de clientes/cuentas disponibles."""
    try:
        query = """
        SELECT DISTINCT cuenta as cliente, COUNT(*) as total_envios
        FROM stats_envios 
        WHERE fecha >= DATE_SUB(CURRENT_DATE, INTERVAL 90 DAY)
        GROUP BY cuenta 
        ORDER BY total_envios DESC, cuenta
        """
        return execute_query_list(query)
    except Exception as e:
        st.error(f"Error obteniendo clientes: {e}")
        return []

@st.cache_data(ttl=300)
def obtener_origenes_disponibles(cliente=None):
    """Obtiene lista de orígenes disponibles."""
    try:
        query = """
        SELECT 
            COALESCE(v.alias, CONCAT(e.tipo_via, ' - ', e.identificador_via)) as origen,
            COUNT(*) as total_envios
        FROM stats_envios e
        LEFT JOIN vias_alias v ON (
            e.cuenta = v.cuenta AND 
            e.tipo_via = v.tipo_via AND 
            e.identificador_via = v.identificador AND 
            v.activo = TRUE
        )
        WHERE e.fecha >= DATE_SUB(CURRENT_DATE, INTERVAL 90 DAY)
        """
        
        params = {}
        if cliente:
            query += " AND e.cuenta = %(cliente)s"
            params['cliente'] = cliente
        
        query += " GROUP BY e.tipo_via, e.identificador_via, v.alias ORDER BY total_envios DESC"
        
        df = execute_query(query, params)
        return df['origen'].tolist() if not df.empty else []
    except Exception as e:
        st.error(f"Error obteniendo orígenes: {e}")
        return []

@st.cache_data(ttl=300)
def obtener_funnels_disponibles(cliente=None):
    """Obtiene lista de funnels disponibles."""
    try:
        query = """
        SELECT DISTINCT funnel
        FROM stats_envios 
        WHERE fecha >= DATE_SUB(CURRENT_DATE, INTERVAL 90 DAY)
        """
        
        params = {}
        if cliente:
            query += " AND cuenta = %(cliente)s"
            params['cliente'] = cliente
        
        query += " GROUP BY funnel ORDER BY COUNT(*) DESC"
        
        return execute_query_list(query, params)
    except Exception as e:
        st.error(f"Error obteniendo funnels: {e}")
        return []

@st.cache_data(ttl=300)
def obtener_datos_dashboard(fecha_inicio: date, fecha_fin: date, cliente=None, origen=None, funnel=None):
    """Obtiene todos los datos necesarios para el dashboard."""
    
    try:
        # Construir parámetros con formato SQLAlchemy
        params = {
            'fecha_inicio': fecha_inicio,
            'fecha_fin': fecha_fin
        }
        
        # Construir filtros adicionales
        filtros_envios = []
        filtros_respuestas = []
        
        if cliente:
            filtros_envios.append("e.cuenta = %(cliente)s")
            filtros_respuestas.append("r.cuenta = %(cliente)s")
            params['cliente'] = cliente
        
        if origen:
            filtros_envios.append("COALESCE(v.alias, CONCAT(e.tipo_via, ' - ', e.identificador_via)) = %(origen)s")
            filtros_respuestas.append("COALESCE(v.alias, CONCAT(r.tipo_via, ' - ', r.identificador_via)) = %(origen)s")
            params['origen'] = origen
        
        if funnel:
            filtros_envios.append("e.funnel = %(funnel)s")
            filtros_respuestas.append("r.funnel = %(funnel)s")
            params['funnel'] = funnel
        
        where_envios = " AND " + " AND ".join(filtros_envios) if filtros_envios else ""
        where_respuestas = " AND " + " AND ".join(filtros_respuestas) if filtros_respuestas else ""
        
        # Query principal para envíos
        query_envios = f"""
        SELECT 
            e.fecha,
            e.cuenta as cliente,
            e.funnel,
            e.tipo_via,
            e.identificador_via,
            COALESCE(v.alias, CONCAT(e.tipo_via, ' - ', e.identificador_via)) as origen,
            e.tipo_actividad,
            e.enviados,
            e.fallidos,
            e.limite_alcanzado,
            e.ultimo_envio
        FROM stats_envios e
        LEFT JOIN vias_alias v ON (
            e.cuenta = v.cuenta AND 
            e.tipo_via = v.tipo_via AND 
            e.identificador_via = v.identificador AND 
            v.activo = TRUE
        )
        WHERE e.fecha BETWEEN %(fecha_inicio)s AND %(fecha_fin)s{where_envios}
        ORDER BY e.fecha DESC
        """
        
        # Query para respuestas
        query_respuestas = f"""
        SELECT 
            r.fecha,
            r.cuenta as cliente,
            r.funnel,
            r.tipo_via,
            r.identificador_via,
            COALESCE(v.alias, CONCAT(r.tipo_via, ' - ', r.identificador_via)) as origen,
            r.total_respuestas,
            r.cualificados,
            r.interesados,
            r.no_interesados,
            r.agendados,
            r.no_cualifica,
            r.respuestas_automaticas,
            r.otros
        FROM stats_respuestas r
        LEFT JOIN vias_alias v ON (
            r.cuenta = v.cuenta AND 
            r.tipo_via = v.tipo_via AND 
            r.identificador_via = v.identificador AND 
            v.activo = TRUE
        )
        WHERE r.fecha BETWEEN %(fecha_inicio)s AND %(fecha_fin)s{where_respuestas}
        ORDER BY r.fecha DESC
        """
        
        # Query para métricas agregadas
        query_metricas = f"""
        SELECT 
            e.cuenta as cliente,
            COALESCE(v.alias, CONCAT(e.tipo_via, ' - ', e.identificador_via)) as origen,
            e.funnel,
            e.tipo_via,
            e.tipo_actividad,
            SUM(e.enviados) as total_enviados,
            SUM(e.fallidos) as total_fallidos,
            SUM(e.limite_alcanzado) as limites_alcanzados,
            COALESCE(SUM(r.total_respuestas), 0) as total_respuestas,
            COALESCE(SUM(r.cualificados), 0) as total_cualificados,
            COALESCE(SUM(r.interesados), 0) as total_interesados,
            COALESCE(SUM(r.agendados), 0) as total_agendados,
            CASE 
                WHEN SUM(e.enviados) > 0 THEN 
                    ROUND((COALESCE(SUM(r.total_respuestas), 0) / SUM(e.enviados)) * 100, 2)
                ELSE 0 
            END as tasa_respuesta,
            CASE 
                WHEN SUM(e.enviados) > 0 THEN 
                    ROUND((COALESCE(SUM(r.agendados), 0) / SUM(e.enviados)) * 100, 2)
                ELSE 0 
            END as tasa_conversion,
            CASE 
                WHEN SUM(e.enviados) > 0 THEN 
                    ROUND(((SUM(e.enviados) - SUM(e.fallidos)) / SUM(e.enviados)) * 100, 2)
                ELSE 0 
            END as tasa_entrega
        FROM stats_envios e
        LEFT JOIN vias_alias v ON (
            e.cuenta = v.cuenta AND 
            e.tipo_via = v.tipo_via AND 
            e.identificador_via = v.identificador AND 
            v.activo = TRUE
        )
        LEFT JOIN stats_respuestas r ON (
            e.fecha = r.fecha AND 
            e.cuenta = r.cuenta AND 
            e.funnel = r.funnel AND 
            e.tipo_via = r.tipo_via AND 
            e.identificador_via = r.identificador_via
        )
        WHERE e.fecha BETWEEN %(fecha_inicio)s AND %(fecha_fin)s{where_envios}
        GROUP BY e.cuenta, COALESCE(v.alias, CONCAT(e.tipo_via, ' - ', e.identificador_via)), e.funnel, e.tipo_via, e.tipo_actividad
        """
        
        # Ejecutar queries usando SQLAlchemy
        df_envios = execute_query(query_envios, params)
        df_respuestas = execute_query(query_respuestas, params)
        df_metricas = execute_query(query_metricas, params)
        
        return df_envios, df_respuestas, df_metricas
        
    except Exception as e:
        st.error(f"Error obteniendo datos del dashboard: {e}")
        return pd.DataFrame(), pd.DataFrame(), pd.DataFrame()

# Funciones de renderizado
def render_professional_header():
    """Renderiza el header profesional del dashboard."""
    st.markdown("""
    <div style="text-align: center; padding: 20px 0; margin-bottom: 30px;">
        <h1 style="color: white; font-size: 3rem; font-weight: 700; margin: 0;">
            🎯 Outbound Marketing Dashboard
        </h1>
        <p style="color: rgba(255,255,255,0.8); font-size: 1.2rem; margin: 10px 0 0 0;">
            Gestión profesional de campañas de prospección
        </p>
    </div>
    """, unsafe_allow_html=True)

def render_advanced_filters():
    """Renderiza filtros avanzados con calendario."""
    st.sidebar.markdown("### 🎛️ Filtros Avanzados")
    
    # Filtros de fecha con calendario
    col1, col2 = st.sidebar.columns(2)
    with col1:
        fecha_inicio = st.date_input(
            "📅 Fecha Inicio",
            value=date.today() - timedelta(days=30),
            max_value=date.today(),
            help="Selecciona la fecha de inicio del análisis"
        )
    
    with col2:
        fecha_fin = st.date_input(
            "📅 Fecha Fin",
            value=date.today(),
            max_value=date.today(),
            help="Selecciona la fecha de fin del análisis"
        )
    
    # Validación de fechas
    if fecha_inicio > fecha_fin:
        st.sidebar.error("❌ La fecha de inicio debe ser anterior a la fecha de fin")
        return None, None, None, None, None
    
    # Filtros de segmentación
    st.sidebar.markdown("### 🎯 Segmentación")
    
    # Filtro de cliente
    clientes = obtener_clientes_disponibles()
    cliente_seleccionado = st.sidebar.selectbox(
        "👤 Cliente",
        ["Todos los clientes"] + clientes,
        help="Filtra por cliente específico"
    )
    cliente = None if cliente_seleccionado == "Todos los clientes" else cliente_seleccionado
    
    # Filtro de origen (dependiente del cliente)
    origenes = obtener_origenes_disponibles(cliente)
    origen_seleccionado = st.sidebar.selectbox(
        "📍 Origen",
        ["Todos los orígenes"] + origenes,
        help="Filtra por origen específico (email, LinkedIn, etc.)"
    )
    origen = None if origen_seleccionado == "Todos los orígenes" else origen_seleccionado
    
    # Filtro de funnel
    funnels = obtener_funnels_disponibles(cliente)
    funnel_seleccionado = st.sidebar.selectbox(
        "🎯 Funnel",
        ["Todos los funnels"] + funnels,
        help="Filtra por funnel/campaña específica"
    )
    funnel = None if funnel_seleccionado == "Todos los funnels" else funnel_seleccionado
    
    # Información del filtro activo
    st.sidebar.markdown("---")
    st.sidebar.markdown("### 📊 Filtros Activos")
    st.sidebar.info(f"""
    **Período**: {fecha_inicio.strftime('%d/%m/%Y')} - {fecha_fin.strftime('%d/%m/%Y')}
    
    **Cliente**: {cliente or 'Todos'}
    
    **Origen**: {origen or 'Todos'}
    
    **Funnel**: {funnel or 'Todos'}
    
    **Días**: {(fecha_fin - fecha_inicio).days + 1}
    """)
    
    # Botón de actualización
    if st.sidebar.button("🔄 Actualizar Dashboard", type="primary"):
        st.cache_data.clear()
        st.rerun()
    
    return fecha_inicio, fecha_fin, cliente, origen, funnel

def get_performance_indicator(value, metric_type):
    """Devuelve un indicador de rendimiento basado en el valor y tipo de métrica."""
    if metric_type == "tasa_respuesta":
        if value > 10:
            return '<span class="performance-indicator performance-good">🟢 Excelente</span>'
        elif value > 5:
            return '<span class="performance-indicator performance-warning">🟡 Buena</span>'
        else:
            return '<span class="performance-indicator performance-danger">🔴 Mejorable</span>'
    elif metric_type == "tasa_conversion":
        if value > 3:
            return '<span class="performance-indicator performance-good">🟢 Excelente</span>'
        elif value > 1:
            return '<span class="performance-indicator performance-warning">🟡 Buena</span>'
        else:
            return '<span class="performance-indicator performance-danger">🔴 Mejorable</span>'
    elif metric_type == "tasa_entrega":
        if value > 95:
            return '<span class="performance-indicator performance-good">🟢 Excelente</span>'
        elif value > 90:
            return '<span class="performance-indicator performance-warning">🟡 Buena</span>'
        else:
            return '<span class="performance-indicator performance-danger">🔴 Mejorable</span>'
    return ""

def render_hierarchical_view(df_metricas):
    """Renderiza vista jerárquica desplegable: Cuenta > Origen > Actividad."""
    st.markdown('<div class="hierarchy-section">', unsafe_allow_html=True)
    st.markdown('<h2 class="hierarchy-title">📊 Vista Jerárquica - Cuenta → Origen → Actividad</h2>', unsafe_allow_html=True)
    
    if df_metricas.empty:
        st.warning("⚠️ No hay datos disponibles para mostrar la vista jerárquica")
        st.markdown('</div>', unsafe_allow_html=True)
        return
    
    # Agrupar datos por jerarquía
    hierarchical_data = df_metricas.groupby(['cliente', 'origen', 'tipo_actividad']).agg({
        'total_enviados': 'sum',
        'total_fallidos': 'sum',
        'total_respuestas': 'sum',
        'total_cualificados': 'sum',
        'total_agendados': 'sum',
        'limites_alcanzados': 'sum',
        'tasa_respuesta': 'mean',
        'tasa_conversion': 'mean',
        'tasa_entrega': 'mean'
    }).reset_index()
    
    # Crear tabs para cada cliente (Nivel 1)
    clientes = hierarchical_data['cliente'].unique()
    if len(clientes) > 1:
        tab_clientes = st.tabs([f"👤 {cliente}" for cliente in clientes])
        
        for idx, cliente in enumerate(clientes):
            with tab_clientes[idx]:
                cliente_data = hierarchical_data[hierarchical_data['cliente'] == cliente]
                
                # Calcular totales por cliente
                cliente_totales = {
                    'enviados': cliente_data['total_enviados'].sum(),
                    'fallidos': cliente_data['total_fallidos'].sum(),
                    'respuestas': cliente_data['total_respuestas'].sum(),
                    'cualificados': cliente_data['total_cualificados'].sum(),
                    'agendados': cliente_data['total_agendados'].sum(),
                    'limites': cliente_data['limites_alcanzados'].sum()
                }
                
                # Calcular tasas por cliente
                cliente_tasa_entrega = ((cliente_totales['enviados'] - cliente_totales['fallidos']) / cliente_totales['enviados'] * 100) if cliente_totales['enviados'] > 0 else 0
                cliente_tasa_respuesta = (cliente_totales['respuestas'] / cliente_totales['enviados'] * 100) if cliente_totales['enviados'] > 0 else 0
                cliente_tasa_conversion = (cliente_totales['agendados'] / cliente_totales['enviados'] * 100) if cliente_totales['enviados'] > 0 else 0
                
                # Contenedor de resumen con estilo mejorado
                st.markdown('<div class="summary-container">', unsafe_allow_html=True)
                
                # Título del resumen con indicadores de rendimiento
                respuesta_indicator = get_performance_indicator(cliente_tasa_respuesta, "tasa_respuesta")
                conversion_indicator = get_performance_indicator(cliente_tasa_conversion, "tasa_conversion")
                entrega_indicator = get_performance_indicator(cliente_tasa_entrega, "tasa_entrega")
                
                st.markdown(f'''
                <div class="summary-title">
                    📊 Resumen General - {cliente}
                    <br>
                    <small style="font-size: 0.9rem; color: #666;">
                        {respuesta_indicator} {conversion_indicator} {entrega_indicator}
                    </small>
                </div>
                ''', unsafe_allow_html=True)
                
                # Métricas del cliente con estilo mejorado
                col1, col2, col3, col4, col5 = st.columns(5)
                
                with col1:
                    st.markdown(f'''
                    <div class="metric-enhanced">
                        <div class="metric-value">{cliente_totales['enviados']:,}</div>
                        <div class="metric-label">📤 Enviados</div>
                    </div>
                    ''', unsafe_allow_html=True)
                
                with col2:
                    st.markdown(f'''
                    <div class="metric-enhanced">
                        <div class="metric-value">{cliente_totales['respuestas']:,}</div>
                        <div class="metric-label">💬 Respuestas</div>
                    </div>
                    ''', unsafe_allow_html=True)
                
                with col3:
                    st.markdown(f'''
                    <div class="metric-enhanced">
                        <div class="metric-value">{cliente_totales['cualificados']:,}</div>
                        <div class="metric-label">🎯 Cualificados</div>
                    </div>
                    ''', unsafe_allow_html=True)
                
                with col4:
                    st.markdown(f'''
                    <div class="metric-enhanced">
                        <div class="metric-value">{cliente_totales['agendados']:,}</div>
                        <div class="metric-label">🗓️ Agendados</div>
                    </div>
                    ''', unsafe_allow_html=True)
                
                with col5:
                    limites_color = "color: #dc3545;" if cliente_totales['limites'] > 0 else "color: #28a745;"
                    st.markdown(f'''
                    <div class="metric-enhanced">
                        <div class="metric-value" style="{limites_color}">{cliente_totales['limites']:,}</div>
                        <div class="metric-label">⚠️ Límites</div>
                    </div>
                    ''', unsafe_allow_html=True)
                
                # Tasas de rendimiento del cliente con estilo mejorado
                col1, col2, col3 = st.columns(3)
                
                with col1:
                    st.markdown(f'''
                    <div class="metric-enhanced">
                        <div class="metric-value">{cliente_tasa_entrega:.1f}%</div>
                        <div class="metric-label">📊 Tasa Entrega</div>
                    </div>
                    ''', unsafe_allow_html=True)
                
                with col2:
                    st.markdown(f'''
                    <div class="metric-enhanced">
                        <div class="metric-value">{cliente_tasa_respuesta:.1f}%</div>
                        <div class="metric-label">📊 Tasa Respuesta</div>
                    </div>
                    ''', unsafe_allow_html=True)
                
                with col3:
                    st.markdown(f'''
                    <div class="metric-enhanced">
                        <div class="metric-value">{cliente_tasa_conversion:.1f}%</div>
                        <div class="metric-label">📊 Tasa Conversión</div>
                    </div>
                    ''', unsafe_allow_html=True)
                
                st.markdown('</div>', unsafe_allow_html=True)
                
                # Divisor visual
                st.markdown('<div class="visual-divider"></div>', unsafe_allow_html=True)
                
                # Selectbox para elegir origen (Nivel 2)
                origenes = cliente_data['origen'].unique()
                if len(origenes) > 1:
                    origen_seleccionado = st.selectbox(
                        "📍 Selecciona un origen para ver detalles:",
                        ["📊 Ver todos los orígenes"] + list(origenes),
                        key=f"origen_selector_{cliente}"
                    )
                    
                    if origen_seleccionado == "📊 Ver todos los orígenes":
                        # Mostrar resumen de todos los orígenes
                        st.markdown('<div class="activities-container">', unsafe_allow_html=True)
                        st.markdown('<div class="activities-title">📍 Resumen por Origen</div>', unsafe_allow_html=True)
                        
                        for origen in origenes:
                            origen_data = cliente_data[cliente_data['origen'] == origen]
                            
                            # Calcular totales por origen
                            origen_totales = {
                                'enviados': origen_data['total_enviados'].sum(),
                                'respuestas': origen_data['total_respuestas'].sum(),
                                'agendados': origen_data['total_agendados'].sum(),
                                'limites': origen_data['limites_alcanzados'].sum()
                            }
                            
                            # Calcular tasas por origen
                            origen_tasa_respuesta = (origen_totales['respuestas'] / origen_totales['enviados'] * 100) if origen_totales['enviados'] > 0 else 0
                            origen_tasa_conversion = (origen_totales['agendados'] / origen_totales['enviados'] * 100) if origen_totales['enviados'] > 0 else 0
                            
                            # Indicadores de rendimiento
                            respuesta_indicator = get_performance_indicator(origen_tasa_respuesta, "tasa_respuesta")
                            conversion_indicator = get_performance_indicator(origen_tasa_conversion, "tasa_conversion")
                            
                            # Mostrar en expander con estilo mejorado
                            expander_title = f"📍 **{origen}** - {origen_totales['enviados']:,} enviados | {origen_tasa_respuesta:.1f}% respuesta | {origen_tasa_conversion:.1f}% conversión"
                            
                            with st.expander(expander_title, expanded=False):
                                # Mostrar indicadores de rendimiento
                                st.markdown(f'''
                                <div class="context-info">
                                    <strong>📊 Rendimiento:</strong> {respuesta_indicator} {conversion_indicator}
                                </div>
                                ''', unsafe_allow_html=True)
                                
                                col1, col2, col3, col4 = st.columns(4)
                                with col1:
                                    st.markdown(f'''
                                    <div class="metric-enhanced">
                                        <div class="metric-value">{origen_totales['enviados']:,}</div>
                                        <div class="metric-label">📤 Enviados</div>
                                    </div>
                                    ''', unsafe_allow_html=True)
                                with col2:
                                    st.markdown(f'''
                                    <div class="metric-enhanced">
                                        <div class="metric-value">{origen_totales['respuestas']:,}</div>
                                        <div class="metric-label">💬 Respuestas</div>
                                    </div>
                                    ''', unsafe_allow_html=True)
                                with col3:
                                    st.markdown(f'''
                                    <div class="metric-enhanced">
                                        <div class="metric-value">{origen_totales['agendados']:,}</div>
                                        <div class="metric-label">🗓️ Agendados</div>
                                    </div>
                                    ''', unsafe_allow_html=True)
                                with col4:
                                    limites_color = "color: #dc3545;" if origen_totales['limites'] > 0 else "color: #28a745;"
                                    st.markdown(f'''
                                    <div class="metric-enhanced">
                                        <div class="metric-value" style="{limites_color}">{origen_totales['limites']:,}</div>
                                        <div class="metric-label">⚠️ Límites</div>
                                    </div>
                                    ''', unsafe_allow_html=True)
                        
                        st.markdown('</div>', unsafe_allow_html=True)
                    else:
                        # Mostrar origen específico
                        origen_data = cliente_data[cliente_data['origen'] == origen_seleccionado]
                        
                        # Calcular totales por origen
                        origen_totales = {
                            'enviados': origen_data['total_enviados'].sum(),
                            'fallidos': origen_data['total_fallidos'].sum(),
                            'respuestas': origen_data['total_respuestas'].sum(),
                            'cualificados': origen_data['total_cualificados'].sum(),
                            'agendados': origen_data['total_agendados'].sum(),
                            'limites': origen_data['limites_alcanzados'].sum()
                        }
                        
                        # Calcular tasas para el origen específico
                        origen_tasa_entrega = ((origen_totales['enviados'] - origen_totales['fallidos']) / origen_totales['enviados'] * 100) if origen_totales['enviados'] > 0 else 0
                        origen_tasa_respuesta = (origen_totales['respuestas'] / origen_totales['enviados'] * 100) if origen_totales['enviados'] > 0 else 0
                        origen_tasa_conversion = (origen_totales['agendados'] / origen_totales['enviados'] * 100) if origen_totales['enviados'] > 0 else 0
                        
                        # Indicadores de rendimiento
                        respuesta_indicator = get_performance_indicator(origen_tasa_respuesta, "tasa_respuesta")
                        conversion_indicator = get_performance_indicator(origen_tasa_conversion, "tasa_conversion")
                        entrega_indicator = get_performance_indicator(origen_tasa_entrega, "tasa_entrega")
                        
                        st.markdown('<div class="summary-container">', unsafe_allow_html=True)
                        st.markdown(f'''
                        <div class="summary-title">
                            📍 Detalle del Origen: {origen_seleccionado}
                            <br>
                            <small style="font-size: 0.9rem; color: #666;">
                                {respuesta_indicator} {conversion_indicator} {entrega_indicator}
                            </small>
                        </div>
                        ''', unsafe_allow_html=True)
                        
                        # Métricas del origen con estilo mejorado
                        col1, col2, col3, col4, col5 = st.columns(5)
                        with col1:
                            st.markdown(f'''
                            <div class="metric-enhanced">
                                <div class="metric-value">{origen_totales['enviados']:,}</div>
                                <div class="metric-label">📤 Enviados</div>
                            </div>
                            ''', unsafe_allow_html=True)
                        with col2:
                            st.markdown(f'''
                            <div class="metric-enhanced">
                                <div class="metric-value">{origen_totales['respuestas']:,}</div>
                                <div class="metric-label">💬 Respuestas</div>
                            </div>
                            ''', unsafe_allow_html=True)
                        with col3:
                            st.markdown(f'''
                            <div class="metric-enhanced">
                                <div class="metric-value">{origen_totales['cualificados']:,}</div>
                                <div class="metric-label">🎯 Cualificados</div>
                            </div>
                            ''', unsafe_allow_html=True)
                        with col4:
                            st.markdown(f'''
                            <div class="metric-enhanced">
                                <div class="metric-value">{origen_totales['agendados']:,}</div>
                                <div class="metric-label">🗓️ Agendados</div>
                            </div>
                            ''', unsafe_allow_html=True)
                        with col5:
                            limites_color = "color: #dc3545;" if origen_totales['limites'] > 0 else "color: #28a745;"
                            st.markdown(f'''
                            <div class="metric-enhanced">
                                <div class="metric-value" style="{limites_color}">{origen_totales['limites']:,}</div>
                                <div class="metric-label">⚠️ Límites</div>
                            </div>
                            ''', unsafe_allow_html=True)
                        
                        st.markdown('</div>', unsafe_allow_html=True)
                        
                        # Mostrar actividades para este origen (Nivel 3)
                        actividades = origen_data['tipo_actividad'].unique()
                        
                        if len(actividades) > 1:
                            st.markdown('<div class="activities-container">', unsafe_allow_html=True)
                            st.markdown('<div class="activities-title">🎯 Actividades del Origen</div>', unsafe_allow_html=True)
                            
                            for actividad in actividades:
                                actividad_data = origen_data[origen_data['tipo_actividad'] == actividad].iloc[0]
                                
                                # Indicadores de rendimiento para la actividad
                                respuesta_indicator = get_performance_indicator(actividad_data['tasa_respuesta'], "tasa_respuesta")
                                conversion_indicator = get_performance_indicator(actividad_data['tasa_conversion'], "tasa_conversion")
                                entrega_indicator = get_performance_indicator(actividad_data['tasa_entrega'], "tasa_entrega")
                                
                                # Mostrar cada actividad en expander con estilo mejorado
                                expander_title = f"🎯 **{actividad}** - {actividad_data['total_enviados']:,} enviados | {actividad_data['tasa_respuesta']:.1f}% respuesta | {actividad_data['tasa_conversion']:.1f}% conversión"
                                
                                with st.expander(expander_title, expanded=False):
                                    # Mostrar indicadores de rendimiento
                                    st.markdown(f'''
                                    <div class="context-info">
                                        <strong>📊 Rendimiento:</strong> {respuesta_indicator} {conversion_indicator} {entrega_indicator}
                                    </div>
                                    ''', unsafe_allow_html=True)
                                    
                                    # Métricas de la actividad con estilo mejorado
                                    col1, col2, col3, col4, col5, col6 = st.columns(6)
                                    with col1:
                                        st.markdown(f'''
                                        <div class="metric-enhanced">
                                            <div class="metric-value">{actividad_data['total_enviados']:,}</div>
                                            <div class="metric-label">📤 Enviados</div>
                                        </div>
                                        ''', unsafe_allow_html=True)
                                    with col2:
                                        st.markdown(f'''
                                        <div class="metric-enhanced">
                                            <div class="metric-value" style="color: #dc3545;">{actividad_data['total_fallidos']:,}</div>
                                            <div class="metric-label">❌ Fallidos</div>
                                        </div>
                                        ''', unsafe_allow_html=True)
                                    with col3:
                                        st.markdown(f'''
                                        <div class="metric-enhanced">
                                            <div class="metric-value">{actividad_data['total_respuestas']:,}</div>
                                            <div class="metric-label">💬 Respuestas</div>
                                        </div>
                                        ''', unsafe_allow_html=True)
                                    with col4:
                                        st.markdown(f'''
                                        <div class="metric-enhanced">
                                            <div class="metric-value">{actividad_data['total_cualificados']:,}</div>
                                            <div class="metric-label">🎯 Cualificados</div>
                                        </div>
                                        ''', unsafe_allow_html=True)
                                    with col5:
                                        st.markdown(f'''
                                        <div class="metric-enhanced">
                                            <div class="metric-value" style="color: #28a745;">{actividad_data['total_agendados']:,}</div>
                                            <div class="metric-label">🗓️ Agendados</div>
                                        </div>
                                        ''', unsafe_allow_html=True)
                                    with col6:
                                        limites_color = "color: #dc3545;" if actividad_data['limites_alcanzados'] > 0 else "color: #28a745;"
                                        st.markdown(f'''
                                        <div class="metric-enhanced">
                                            <div class="metric-value" style="{limites_color}">{actividad_data['limites_alcanzados']:,}</div>
                                            <div class="metric-label">⚠️ Límites</div>
                                        </div>
                                        ''', unsafe_allow_html=True)
                                    
                                    # Divisor visual
                                    st.markdown('<div class="visual-divider"></div>', unsafe_allow_html=True)
                                    
                                    # Tasas de rendimiento con estilo mejorado
                                    col1, col2, col3 = st.columns(3)
                                    with col1:
                                        st.markdown(f'''
                                        <div class="metric-enhanced">
                                            <div class="metric-value">{actividad_data['tasa_entrega']:.1f}%</div>
                                            <div class="metric-label">📊 Tasa Entrega</div>
                                        </div>
                                        ''', unsafe_allow_html=True)
                                    with col2:
                                        st.markdown(f'''
                                        <div class="metric-enhanced">
                                            <div class="metric-value">{actividad_data['tasa_respuesta']:.1f}%</div>
                                            <div class="metric-label">📊 Tasa Respuesta</div>
                                        </div>
                                        ''', unsafe_allow_html=True)
                                    with col3:
                                        st.markdown(f'''
                                        <div class="metric-enhanced">
                                            <div class="metric-value">{actividad_data['tasa_conversion']:.1f}%</div>
                                            <div class="metric-label">📊 Tasa Conversión</div>
                                        </div>
                                        ''', unsafe_allow_html=True)
                            
                            st.markdown('</div>', unsafe_allow_html=True)
                        else:
                            # Solo una actividad
                            actividad_data = origen_data.iloc[0]
                            
                            # Indicadores de rendimiento
                            respuesta_indicator = get_performance_indicator(actividad_data['tasa_respuesta'], "tasa_respuesta")
                            conversion_indicator = get_performance_indicator(actividad_data['tasa_conversion'], "tasa_conversion")
                            entrega_indicator = get_performance_indicator(actividad_data['tasa_entrega'], "tasa_entrega")
                            
                            st.markdown(f'''
                            <div class="context-info">
                                <strong>🎯 Actividad única:</strong> {actividad_data['tipo_actividad']}
                                <br>
                                <strong>📊 Rendimiento:</strong> {respuesta_indicator} {conversion_indicator} {entrega_indicator}
                            </div>
                            ''', unsafe_allow_html=True)
                            
                            # Tasas de rendimiento con estilo mejorado
                            col1, col2, col3 = st.columns(3)
                            with col1:
                                st.markdown(f'''
                                <div class="metric-enhanced">
                                    <div class="metric-value">{actividad_data['tasa_entrega']:.1f}%</div>
                                    <div class="metric-label">📊 Tasa Entrega</div>
                                </div>
                                ''', unsafe_allow_html=True)
                            with col2:
                                st.markdown(f'''
                                <div class="metric-enhanced">
                                    <div class="metric-value">{actividad_data['tasa_respuesta']:.1f}%</div>
                                    <div class="metric-label">📊 Tasa Respuesta</div>
                                </div>
                                ''', unsafe_allow_html=True)
                            with col3:
                                st.markdown(f'''
                                <div class="metric-enhanced">
                                    <div class="metric-value">{actividad_data['tasa_conversion']:.1f}%</div>
                                    <div class="metric-label">📊 Tasa Conversión</div>
                                </div>
                                ''', unsafe_allow_html=True)
                else:
                    # Solo un origen
                    origen_data = cliente_data
                    st.markdown(f"### 📍 Origen único: {origenes[0]}")
                    
                    # Mostrar actividades directamente
                    actividades = origen_data['tipo_actividad'].unique()
                    
                    if len(actividades) > 1:
                        st.markdown("### 🎯 Actividades")
                        for actividad in actividades:
                            actividad_data = origen_data[origen_data['tipo_actividad'] == actividad].iloc[0]
                            
                            # Mostrar cada actividad en expander
                            with st.expander(f"🎯 **{actividad}** - {actividad_data['total_enviados']:,} enviados | {actividad_data['tasa_respuesta']:.1f}% respuesta | {actividad_data['tasa_conversion']:.1f}% conversión", expanded=False):
                                
                                # Métricas de la actividad
                                col1, col2, col3, col4, col5, col6 = st.columns(6)
                                with col1:
                                    st.metric("📤 Enviados", f"{actividad_data['total_enviados']:,}")
                                with col2:
                                    st.metric("❌ Fallidos", f"{actividad_data['total_fallidos']:,}")
                                with col3:
                                    st.metric("💬 Respuestas", f"{actividad_data['total_respuestas']:,}")
                                with col4:
                                    st.metric("🎯 Cualificados", f"{actividad_data['total_cualificados']:,}")
                                with col5:
                                    st.metric("🗓️ Agendados", f"{actividad_data['total_agendados']:,}")
                                with col6:
                                    st.metric("⚠️ Límites", f"{actividad_data['limites_alcanzados']:,}")
                                
                                # Tasas de rendimiento
                                col1, col2, col3 = st.columns(3)
                                with col1:
                                    st.metric("📊 Tasa Entrega", f"{actividad_data['tasa_entrega']:.1f}%")
                                with col2:
                                    st.metric("📊 Tasa Respuesta", f"{actividad_data['tasa_respuesta']:.1f}%")
                                with col3:
                                    st.metric("📊 Tasa Conversión", f"{actividad_data['tasa_conversion']:.1f}%")
                    else:
                        # Solo una actividad
                        actividad_data = origen_data.iloc[0]
                        st.info(f"🎯 **Actividad única**: {actividad_data['tipo_actividad']}")
                        
                        # Tasas de rendimiento
                        col1, col2, col3 = st.columns(3)
                        with col1:
                            st.metric("📊 Tasa Entrega", f"{actividad_data['tasa_entrega']:.1f}%")
                        with col2:
                            st.metric("📊 Tasa Respuesta", f"{actividad_data['tasa_respuesta']:.1f}%")
                        with col3:
                            st.metric("📊 Tasa Conversión", f"{actividad_data['tasa_conversion']:.1f}%")
    else:
        # Solo un cliente - mostrar directamente
        cliente = clientes[0]
        cliente_data = hierarchical_data[hierarchical_data['cliente'] == cliente]
        
        st.markdown(f"### 👤 Cliente único: {cliente}")
        
        # Selectbox para elegir origen
        origenes = cliente_data['origen'].unique()
        if len(origenes) > 1:
            origen_seleccionado = st.selectbox(
                "📍 Selecciona un origen para ver detalles:",
                ["📊 Ver todos los orígenes"] + list(origenes),
                key="origen_selector_unico"
            )
            
            if origen_seleccionado == "📊 Ver todos los orígenes":
                # Mostrar resumen de todos los orígenes
                st.markdown("### 📍 Resumen por Origen")
                for origen in origenes:
                    origen_data = cliente_data[cliente_data['origen'] == origen]
                    
                    # Calcular totales por origen
                    origen_totales = {
                        'enviados': origen_data['total_enviados'].sum(),
                        'respuestas': origen_data['total_respuestas'].sum(),
                        'agendados': origen_data['total_agendados'].sum(),
                        'limites': origen_data['limites_alcanzados'].sum()
                    }
                    
                    # Calcular tasas por origen
                    origen_tasa_respuesta = (origen_totales['respuestas'] / origen_totales['enviados'] * 100) if origen_totales['enviados'] > 0 else 0
                    origen_tasa_conversion = (origen_totales['agendados'] / origen_totales['enviados'] * 100) if origen_totales['enviados'] > 0 else 0
                    
                    # Mostrar en expander
                    with st.expander(f"📍 **{origen}** - {origen_totales['enviados']:,} enviados | {origen_tasa_respuesta:.1f}% respuesta | {origen_tasa_conversion:.1f}% conversión", expanded=False):
                        col1, col2, col3, col4 = st.columns(4)
                        with col1:
                            st.metric("📤 Enviados", f"{origen_totales['enviados']:,}")
                        with col2:
                            st.metric("💬 Respuestas", f"{origen_totales['respuestas']:,}")
                        with col3:
                            st.metric("🗓️ Agendados", f"{origen_totales['agendados']:,}")
                        with col4:
                            st.metric("⚠️ Límites", f"{origen_totales['limites']:,}")
            else:
                # Mostrar origen específico con sus actividades
                origen_data = cliente_data[cliente_data['origen'] == origen_seleccionado]
                
                st.markdown(f"### 📍 Detalle del Origen: {origen_seleccionado}")
                
                # Mostrar actividades
                actividades = origen_data['tipo_actividad'].unique()
                
                if len(actividades) > 1:
                    st.markdown("### 🎯 Actividades del Origen")
                    for actividad in actividades:
                        actividad_data = origen_data[origen_data['tipo_actividad'] == actividad].iloc[0]
                        
                        # Mostrar cada actividad en expander
                        with st.expander(f"🎯 **{actividad}** - {actividad_data['total_enviados']:,} enviados | {actividad_data['tasa_respuesta']:.1f}% respuesta | {actividad_data['tasa_conversion']:.1f}% conversión", expanded=False):
                            
                            # Métricas de la actividad
                            col1, col2, col3, col4, col5, col6 = st.columns(6)
                            with col1:
                                st.metric("📤 Enviados", f"{actividad_data['total_enviados']:,}")
                            with col2:
                                st.metric("❌ Fallidos", f"{actividad_data['total_fallidos']:,}")
                            with col3:
                                st.metric("💬 Respuestas", f"{actividad_data['total_respuestas']:,}")
                            with col4:
                                st.metric("🎯 Cualificados", f"{actividad_data['total_cualificados']:,}")
                            with col5:
                                st.metric("🗓️ Agendados", f"{actividad_data['total_agendados']:,}")
                            with col6:
                                st.metric("⚠️ Límites", f"{actividad_data['limites_alcanzados']:,}")
                            
                            # Tasas de rendimiento
                            col1, col2, col3 = st.columns(3)
                            with col1:
                                st.metric("📊 Tasa Entrega", f"{actividad_data['tasa_entrega']:.1f}%")
                            with col2:
                                st.metric("📊 Tasa Respuesta", f"{actividad_data['tasa_respuesta']:.1f}%")
                            with col3:
                                st.metric("📊 Tasa Conversión", f"{actividad_data['tasa_conversion']:.1f}%")
                else:
                    # Solo una actividad
                    actividad_data = origen_data.iloc[0]
                    st.info(f"🎯 **Actividad única**: {actividad_data['tipo_actividad']}")
                    
                    # Tasas de rendimiento
                    col1, col2, col3 = st.columns(3)
                    with col1:
                        st.metric("📊 Tasa Entrega", f"{actividad_data['tasa_entrega']:.1f}%")
                    with col2:
                        st.metric("📊 Tasa Respuesta", f"{actividad_data['tasa_respuesta']:.1f}%")
                    with col3:
                        st.metric("📊 Tasa Conversión", f"{actividad_data['tasa_conversion']:.1f}%")
        else:
            # Solo un origen - mostrar actividades directamente
            st.markdown(f"### 📍 Origen único: {origenes[0]}")
            
            # Mostrar actividades directamente
            actividades = cliente_data['tipo_actividad'].unique()
            
            if len(actividades) > 1:
                st.markdown("### 🎯 Actividades")
                for actividad in actividades:
                    actividad_data = cliente_data[cliente_data['tipo_actividad'] == actividad].iloc[0]
                    
                    # Mostrar cada actividad en expander
                    with st.expander(f"🎯 **{actividad}** - {actividad_data['total_enviados']:,} enviados | {actividad_data['tasa_respuesta']:.1f}% respuesta | {actividad_data['tasa_conversion']:.1f}% conversión", expanded=False):
                        
                        # Métricas de la actividad
                        col1, col2, col3, col4, col5, col6 = st.columns(6)
                        with col1:
                            st.metric("📤 Enviados", f"{actividad_data['total_enviados']:,}")
                        with col2:
                            st.metric("❌ Fallidos", f"{actividad_data['total_fallidos']:,}")
                        with col3:
                            st.metric("💬 Respuestas", f"{actividad_data['total_respuestas']:,}")
                        with col4:
                            st.metric("🎯 Cualificados", f"{actividad_data['total_cualificados']:,}")
                        with col5:
                            st.metric("🗓️ Agendados", f"{actividad_data['total_agendados']:,}")
                        with col6:
                            st.metric("⚠️ Límites", f"{actividad_data['limites_alcanzados']:,}")
                        
                        # Tasas de rendimiento
                        col1, col2, col3 = st.columns(3)
                        with col1:
                            st.metric("📊 Tasa Entrega", f"{actividad_data['tasa_entrega']:.1f}%")
                        with col2:
                            st.metric("📊 Tasa Respuesta", f"{actividad_data['tasa_respuesta']:.1f}%")
                        with col3:
                            st.metric("📊 Tasa Conversión", f"{actividad_data['tasa_conversion']:.1f}%")
            else:
                # Solo una actividad
                actividad_data = cliente_data.iloc[0]
                st.info(f"🎯 **Actividad única**: {actividad_data['tipo_actividad']}")
                
                # Tasas de rendimiento
                col1, col2, col3 = st.columns(3)
                with col1:
                    st.metric("📊 Tasa Entrega", f"{actividad_data['tasa_entrega']:.1f}%")
                with col2:
                    st.metric("📊 Tasa Respuesta", f"{actividad_data['tasa_respuesta']:.1f}%")
                with col3:
                    st.metric("📊 Tasa Conversión", f"{actividad_data['tasa_conversion']:.1f}%")
    
    st.markdown('</div>', unsafe_allow_html=True)

def render_executive_summary(df_metricas):
    """Renderiza resumen ejecutivo con KPIs principales."""
    st.markdown('<div class="dashboard-section">', unsafe_allow_html=True)
    st.markdown('<h2 class="section-title">📈 Resumen Ejecutivo</h2>', unsafe_allow_html=True)
    
    # Calcular métricas globales
    total_enviados = df_metricas['total_enviados'].sum()
    total_fallidos = df_metricas['total_fallidos'].sum()
    total_respuestas = df_metricas['total_respuestas'].sum()
    total_cualificados = df_metricas['total_cualificados'].sum()
    total_agendados = df_metricas['total_agendados'].sum()
    limites_alcanzados = df_metricas['limites_alcanzados'].sum()
    
    # Calcular tasas
    tasa_entrega = ((total_enviados - total_fallidos) / total_enviados * 100) if total_enviados > 0 else 0
    tasa_respuesta = (total_respuestas / total_enviados * 100) if total_enviados > 0 else 0
    tasa_cualificacion = (total_cualificados / total_respuestas * 100) if total_respuestas > 0 else 0
    tasa_conversion = (total_agendados / total_enviados * 100) if total_enviados > 0 else 0
    
    # Renderizar métricas en columnas
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-value">{total_enviados:,}</div>
            <div class="metric-label">📤 Contactos Alcanzados</div>
            <div class="metric-change metric-neutral">
                🎯 {total_enviados - total_fallidos:,} entregados
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-value">{tasa_entrega:.1f}%</div>
            <div class="metric-label">✅ Tasa de Entrega</div>
            <div class="metric-change metric-{'positive' if tasa_entrega > 95 else 'warning' if tasa_entrega > 90 else 'negative'}">
                {'🟢 Excelente' if tasa_entrega > 95 else '🟡 Buena' if tasa_entrega > 90 else '🔴 Mejorable'}
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-value">{total_respuestas:,}</div>
            <div class="metric-label">💬 Respuestas Obtenidas</div>
            <div class="metric-change metric-neutral">
                📊 {total_respuestas / max(1, total_enviados) * 100:.1f}% del total
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-value">{tasa_respuesta:.1f}%</div>
            <div class="metric-label">📊 Tasa de Respuesta</div>
            <div class="metric-change metric-{'positive' if tasa_respuesta > 10 else 'warning' if tasa_respuesta > 5 else 'negative'}">
                {'🟢 Excelente' if tasa_respuesta > 10 else '🟡 Buena' if tasa_respuesta > 5 else '🔴 Mejorable'}
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-value">{total_cualificados:,}</div>
            <div class="metric-label">🎯 Leads Cualificados</div>
            <div class="metric-change metric-neutral">
                📈 {total_cualificados / max(1, total_respuestas) * 100:.1f}% de respuestas
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-value">{tasa_cualificacion:.1f}%</div>
            <div class="metric-label">⭐ Tasa de Cualificación</div>
            <div class="metric-change metric-{'positive' if tasa_cualificacion > 30 else 'warning' if tasa_cualificacion > 20 else 'negative'}">
                {'🟢 Excelente' if tasa_cualificacion > 30 else '🟡 Buena' if tasa_cualificacion > 20 else '🔴 Mejorable'}
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    with col4:
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-value">{total_agendados:,}</div>
            <div class="metric-label">🗓️ Meetings Agendados</div>
            <div class="metric-change metric-neutral">
                🎯 {total_agendados / max(1, total_enviados) * 100:.1f}% conversión
            </div>
        </div>
        """, unsafe_allow_html=True)
        
        st.markdown(f"""
        <div class="metric-card">
            <div class="metric-value">{tasa_conversion:.1f}%</div>
            <div class="metric-label">💰 Tasa de Conversión</div>
            <div class="metric-change metric-{'positive' if tasa_conversion > 3 else 'warning' if tasa_conversion > 1 else 'negative'}">
                {'🟢 Excelente' if tasa_conversion > 3 else '🟡 Buena' if tasa_conversion > 1 else '🔴 Mejorable'}
            </div>
        </div>
        """, unsafe_allow_html=True)
    
    # Alertas importantes
    if limites_alcanzados > 0:
        st.markdown(f"""
        <div class="alert-warning">
            <strong>⚠️ Límites Alcanzados:</strong> {limites_alcanzados:,} orígenes han alcanzado sus límites diarios/semanales.
            Esto puede estar afectando el volumen de outbound.
        </div>
        """, unsafe_allow_html=True)
    
    st.markdown('</div>', unsafe_allow_html=True)

def render_client_performance(df_metricas):
    """Renderiza análisis de rendimiento por cliente."""
    st.markdown('<div class="dashboard-section">', unsafe_allow_html=True)
    st.markdown('<h2 class="section-title">👥 Rendimiento por Cliente</h2>', unsafe_allow_html=True)
    
    # Agrupar por cliente
    cliente_metrics = df_metricas.groupby('cliente').agg({
        'total_enviados': 'sum',
        'total_fallidos': 'sum',
        'total_respuestas': 'sum',
        'total_cualificados': 'sum',
        'total_agendados': 'sum',
        'limites_alcanzados': 'sum'
    }).reset_index()
    
    # Calcular métricas derivadas
    cliente_metrics['tasa_entrega'] = ((cliente_metrics['total_enviados'] - cliente_metrics['total_fallidos']) / cliente_metrics['total_enviados'] * 100).round(2)
    cliente_metrics['tasa_respuesta'] = (cliente_metrics['total_respuestas'] / cliente_metrics['total_enviados'] * 100).round(2)
    cliente_metrics['tasa_conversion'] = (cliente_metrics['total_agendados'] / cliente_metrics['total_enviados'] * 100).round(2)
    
    # Ordenar por volumen
    cliente_metrics = cliente_metrics.sort_values('total_enviados', ascending=False)
    
    # Gráfico de barras comparativo
    col1, col2 = st.columns(2)
    
    with col1:
        fig_volumen = px.bar(
            cliente_metrics,
            x='cliente',
            y='total_enviados',
            title="📊 Volumen de Outbound por Cliente",
            labels={'total_enviados': 'Contactos Alcanzados', 'cliente': 'Cliente'},
            color='total_enviados',
            color_continuous_scale='Blues'
        )
        fig_volumen.update_layout(
            height=400,
            showlegend=False,
            title_font_size=16,
            title_x=0.5
        )
        st.plotly_chart(fig_volumen, use_container_width=True)
    
    with col2:
        fig_conversion = px.bar(
            cliente_metrics,
            x='cliente',
            y='tasa_conversion',
            title="💰 Tasa de Conversión por Cliente",
            labels={'tasa_conversion': 'Tasa de Conversión (%)', 'cliente': 'Cliente'},
            color='tasa_conversion',
            color_continuous_scale='Greens'
        )
        fig_conversion.update_layout(
            height=400,
            showlegend=False,
            title_font_size=16,
            title_x=0.5
        )
        st.plotly_chart(fig_conversion, use_container_width=True)
    
    # Tabla detallada
    st.markdown("### 📋 Tabla Comparativa Detallada")
    
    # Formatear tabla para mostrar
    tabla_display = cliente_metrics.rename(columns={
        'cliente': 'Cliente',
        'total_enviados': 'Enviados',
        'total_fallidos': 'Fallidos',
        'total_respuestas': 'Respuestas',
        'total_cualificados': 'Cualificados',
        'total_agendados': 'Agendados',
        'tasa_entrega': 'Entrega (%)',
        'tasa_respuesta': 'Respuesta (%)',
        'tasa_conversion': 'Conversión (%)'
    })
    
    # Aplicar formato con colores
    def highlight_performance(val):
        if isinstance(val, (int, float)):
            if 'Entrega' in str(val) or 'entrega' in str(val):
                return 'background-color: #d4edda' if val > 95 else 'background-color: #fff3cd' if val > 90 else 'background-color: #f8d7da'
            elif 'Respuesta' in str(val) or 'respuesta' in str(val):
                return 'background-color: #d4edda' if val > 10 else 'background-color: #fff3cd' if val > 5 else 'background-color: #f8d7da'
            elif 'Conversión' in str(val) or 'conversion' in str(val):
                return 'background-color: #d4edda' if val > 3 else 'background-color: #fff3cd' if val > 1 else 'background-color: #f8d7da'
        return ''
    
    st.dataframe(
        tabla_display,
        use_container_width=True,
        hide_index=True
    )
    
    st.markdown('</div>', unsafe_allow_html=True)

def render_origin_performance(df_metricas):
    """Renderiza análisis de rendimiento por origen."""
    st.markdown('<div class="dashboard-section">', unsafe_allow_html=True)
    st.markdown('<h2 class="section-title">📍 Rendimiento por Origen</h2>', unsafe_allow_html=True)
    
    # Agrupar por origen
    origen_metrics = df_metricas.groupby(['origen', 'tipo_via']).agg({
        'total_enviados': 'sum',
        'total_fallidos': 'sum',
        'total_respuestas': 'sum',
        'total_cualificados': 'sum',
        'total_agendados': 'sum',
        'limites_alcanzados': 'sum'
    }).reset_index()
    
    # Calcular métricas derivadas
    origen_metrics['tasa_entrega'] = ((origen_metrics['total_enviados'] - origen_metrics['total_fallidos']) / origen_metrics['total_enviados'] * 100).round(2)
    origen_metrics['tasa_respuesta'] = (origen_metrics['total_respuestas'] / origen_metrics['total_enviados'] * 100).round(2)
    origen_metrics['tasa_conversion'] = (origen_metrics['total_agendados'] / origen_metrics['total_enviados'] * 100).round(2)
    
    # Ordenar por volumen
    origen_metrics = origen_metrics.sort_values('total_enviados', ascending=False)
    
    # Gráfico de rendimiento por tipo de vía
    col1, col2 = st.columns(2)
    
    with col1:
        # Agrupar por tipo de vía
        via_metrics = origen_metrics.groupby('tipo_via').agg({
            'total_enviados': 'sum',
            'total_respuestas': 'sum',
            'total_agendados': 'sum'
        }).reset_index()
        
        fig_via = px.pie(
            via_metrics,
            values='total_enviados',
            names='tipo_via',
            title="📊 Distribución de Volumen por Canal",
            color_discrete_sequence=px.colors.qualitative.Set3
        )
        fig_via.update_traces(textposition='inside', textinfo='percent+label')
        fig_via.update_layout(height=400, title_font_size=16, title_x=0.5)
        st.plotly_chart(fig_via, use_container_width=True)
    
    with col2:
        # Top 10 orígenes por conversión
        top_origenes = origen_metrics.head(10)
        
        fig_top = px.bar(
            top_origenes,
            x='tasa_conversion',
            y='origen',
            orientation='h',
            title="🎯 Top 10 Orígenes por Conversión",
            labels={'tasa_conversion': 'Tasa de Conversión (%)', 'origen': 'Origen'},
            color='tasa_conversion',
            color_continuous_scale='Viridis'
        )
        fig_top.update_layout(
            height=400,
            title_font_size=16,
            title_x=0.5,
            yaxis={'categoryorder': 'total ascending'}
        )
        st.plotly_chart(fig_top, use_container_width=True)
    
    # Tabla detallada de orígenes
    st.markdown("### 📋 Análisis Detallado por Origen")
    
    # Mostrar solo top 20 para mejor visualización
    top_20_origenes = origen_metrics.head(20)
    
    tabla_origenes = top_20_origenes.rename(columns={
        'origen': 'Origen',
        'tipo_via': 'Canal',
        'total_enviados': 'Enviados',
        'total_respuestas': 'Respuestas',
        'total_agendados': 'Agendados',
        'tasa_entrega': 'Entrega (%)',
        'tasa_respuesta': 'Respuesta (%)',
        'tasa_conversion': 'Conversión (%)',
        'limites_alcanzados': 'Límites'
    })
    
    st.dataframe(
        tabla_origenes,
        use_container_width=True,
        hide_index=True
    )
    
    st.markdown('</div>', unsafe_allow_html=True)

def render_campaign_funnel(df_metricas):
    """Renderiza análisis de embudo de conversión."""
    st.markdown('<div class="dashboard-section">', unsafe_allow_html=True)
    st.markdown('<h2 class="section-title">🎯 Embudo de Conversión</h2>', unsafe_allow_html=True)
    
    # Calcular métricas del embudo
    total_enviados = df_metricas['total_enviados'].sum()
    total_entregados = total_enviados - df_metricas['total_fallidos'].sum()
    total_respuestas = df_metricas['total_respuestas'].sum()
    total_cualificados = df_metricas['total_cualificados'].sum()
    total_agendados = df_metricas['total_agendados'].sum()
    
    # Crear gráfico de embudo
    fig_funnel = go.Figure(go.Funnel(
        y=["📤 Contactos Enviados", "✅ Contactos Entregados", "💬 Respuestas", "🎯 Cualificados", "🗓️ Agendados"],
        x=[total_enviados, total_entregados, total_respuestas, total_cualificados, total_agendados],
        textinfo="value+percent initial+percent previous",
        marker=dict(
            color=["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd"],
            line=dict(width=2, color="white")
        ),
        connector={"line": {"color": "royalblue", "dash": "solid", "width": 3}}
    ))
    
    fig_funnel.update_layout(
        title="📊 Embudo de Conversión - Vista Global",
        title_font_size=18,
        title_x=0.5,
        height=500,
        font=dict(size=12)
    )
    
    st.plotly_chart(fig_funnel, use_container_width=True)
    
    # Métricas de eficiencia del embudo
    col1, col2, col3 = st.columns(3)
    
    with col1:
        tasa_entrega = (total_entregados / total_enviados * 100) if total_enviados > 0 else 0
        st.metric(
            "📬 Tasa de Entrega",
            f"{tasa_entrega:.1f}%",
            help="% de contactos que recibieron el mensaje"
        )
    
    with col2:
        tasa_engagement = (total_respuestas / total_entregados * 100) if total_entregados > 0 else 0
        st.metric(
            "💬 Tasa de Engagement",
            f"{tasa_engagement:.1f}%",
            help="% de contactos entregados que respondieron"
        )
    
    with col3:
        tasa_cierre = (total_agendados / total_cualificados * 100) if total_cualificados > 0 else 0
        st.metric(
            "🎯 Tasa de Cierre",
            f"{tasa_cierre:.1f}%",
            help="% de cualificados que agendaron meeting"
        )
    
    st.markdown('</div>', unsafe_allow_html=True)

def render_temporal_analysis(df_envios, df_respuestas):
    """Renderiza análisis temporal de las campañas."""
    st.markdown('<div class="dashboard-section">', unsafe_allow_html=True)
    st.markdown('<h2 class="section-title">📅 Análisis Temporal</h2>', unsafe_allow_html=True)
    
    if df_envios.empty and df_respuestas.empty:
        st.warning("⚠️ No hay datos temporales disponibles para el período seleccionado")
        st.markdown('</div>', unsafe_allow_html=True)
        return
    
    # Preparar datos diarios
    daily_envios = df_envios.groupby('fecha').agg({
        'enviados': 'sum',
        'fallidos': 'sum'
    }).reset_index() if not df_envios.empty else pd.DataFrame()
    
    daily_respuestas = df_respuestas.groupby('fecha').agg({
        'total_respuestas': 'sum',
        'cualificados': 'sum',
        'agendados': 'sum'
    }).reset_index() if not df_respuestas.empty else pd.DataFrame()
    
    # Crear gráfico temporal combinado
    fig_temporal = make_subplots(
        rows=2, cols=1,
        subplot_titles=('📤 Actividad de Outbound Diaria', '📥 Respuestas y Conversiones Diarias'),
        vertical_spacing=0.12,
        specs=[[{"secondary_y": True}], [{"secondary_y": True}]]
    )
    
    # Gráfico de envíos
    if not daily_envios.empty:
        fig_temporal.add_trace(
            go.Scatter(
                x=daily_envios['fecha'],
                y=daily_envios['enviados'],
                mode='lines+markers',
                name='📤 Enviados',
                line=dict(color='#1f77b4', width=3),
                marker=dict(size=8),
                fill='tonexty'
            ),
            row=1, col=1
        )
        
        fig_temporal.add_trace(
            go.Scatter(
                x=daily_envios['fecha'],
                y=daily_envios['fallidos'],
                mode='lines+markers',
                name='❌ Fallidos',
                line=dict(color='#d62728', width=3),
                marker=dict(size=8)
            ),
            row=1, col=1
        )
    
    # Gráfico de respuestas
    if not daily_respuestas.empty:
        fig_temporal.add_trace(
            go.Scatter(
                x=daily_respuestas['fecha'],
                y=daily_respuestas['total_respuestas'],
                mode='lines+markers',
                name='💬 Respuestas',
                line=dict(color='#2ca02c', width=3),
                marker=dict(size=8)
            ),
            row=2, col=1
        )
        
        fig_temporal.add_trace(
            go.Scatter(
                x=daily_respuestas['fecha'],
                y=daily_respuestas['agendados'],
                mode='lines+markers',
                name='🗓️ Agendados',
                line=dict(color='#ff7f0e', width=3),
                marker=dict(size=8)
            ),
            row=2, col=1
        )
    
    fig_temporal.update_layout(
        height=700,
        title_font_size=16,
        showlegend=True,
        legend=dict(
            orientation="h",
            yanchor="bottom",
            y=1.02,
            xanchor="right",
            x=1
        )
    )
    
    st.plotly_chart(fig_temporal, use_container_width=True)
    
    st.markdown('</div>', unsafe_allow_html=True)

def render_alerts_and_insights(df_metricas):
    """Renderiza alertas y insights automáticos."""
    st.markdown('<div class="dashboard-section">', unsafe_allow_html=True)
    st.markdown('<h2 class="section-title">🚨 Alertas e Insights</h2>', unsafe_allow_html=True)
    
    alerts = []
    insights = []
    
    # Análisis de rendimiento
    total_enviados = df_metricas['total_enviados'].sum()
    total_respuestas = df_metricas['total_respuestas'].sum()
    limites_alcanzados = df_metricas['limites_alcanzados'].sum()
    
    if total_enviados > 0:
        tasa_respuesta_global = (total_respuestas / total_enviados * 100)
        
        # Alertas por tasa de respuesta
        if tasa_respuesta_global < 3:
            alerts.append({
                'tipo': 'danger',
                'mensaje': f'⚠️ Tasa de respuesta muy baja ({tasa_respuesta_global:.1f}%). Revisar mensajes y segmentación.'
            })
        elif tasa_respuesta_global > 15:
            insights.append({
                'tipo': 'success',
                'mensaje': f'🎉 Excelente tasa de respuesta ({tasa_respuesta_global:.1f}%). Considera escalar esta estrategia.'
            })
    
    # Alertas por límites alcanzados
    if limites_alcanzados > 0:
        alerts.append({
            'tipo': 'warning',
            'mensaje': f'⚠️ {limites_alcanzados} orígenes han alcanzado límites. Esto puede estar limitando el crecimiento.'
        })
    
    # Análisis de orígenes top performers
    if not df_metricas.empty and len(df_metricas) > 0:
        # Filtrar orígenes con al menos 10 envíos para hacer análisis más confiable
        df_significativo = df_metricas[df_metricas['total_enviados'] >= 10]
        
        if not df_significativo.empty:
            top_origen = df_significativo.loc[df_significativo['tasa_conversion'].idxmax()]
            if top_origen['tasa_conversion'] > 5:
                insights.append({
                    'tipo': 'success',
                    'mensaje': f'🌟 Origen destacado: "{top_origen["origen"]}" con {top_origen["tasa_conversion"]:.1f}% de conversión ({top_origen["total_enviados"]} envíos).'
                })
    
    # Análisis de clientes
    if not df_metricas.empty and len(df_metricas) > 0:
        cliente_performance = df_metricas.groupby('cliente').agg({
            'tasa_conversion': 'mean',
            'total_enviados': 'sum'
        }).reset_index()
        
        if not cliente_performance.empty:
            # Filtrar clientes con al menos 20 envíos
            cliente_significativo = cliente_performance[cliente_performance['total_enviados'] >= 20]
            
            if not cliente_significativo.empty:
                mejor_cliente = cliente_significativo.loc[cliente_significativo['tasa_conversion'].idxmax()]
                insights.append({
                    'tipo': 'success',
                    'mensaje': f'🏆 Cliente con mejor rendimiento: "{mejor_cliente["cliente"]}" ({mejor_cliente["tasa_conversion"]:.1f}% conversión, {mejor_cliente["total_enviados"]} envíos).'
                })
            else:
                insights.append({
                    'tipo': 'warning',
                    'mensaje': '📊 Datos insuficientes para análisis de clientes. Se necesitan al menos 20 envíos por cliente.'
                })
    
    # Renderizar alertas
    if alerts:
        st.markdown('<h3 style="color: #dc3545; margin-bottom: 20px;">🚨 Alertas Importantes</h3>', unsafe_allow_html=True)
        for alert in alerts:
            st.markdown(f'<div class="alert-{alert["tipo"]}">{alert["mensaje"]}</div>', unsafe_allow_html=True)
    
    # Renderizar insights
    if insights:
        st.markdown('<h3 style="color: #28a745; margin-bottom: 20px;">💡 Insights y Oportunidades</h3>', unsafe_allow_html=True)
        for insight in insights:
            st.markdown(f'<div class="alert-{insight["tipo"]}">{insight["mensaje"]}</div>', unsafe_allow_html=True)
    
    if not alerts and not insights:
        st.info("✅ No hay alertas críticas. El rendimiento está dentro de los parámetros normales.")
    
    st.markdown('</div>', unsafe_allow_html=True)

def main():
    """Función principal del dashboard profesional."""
    # Cargar CSS personalizado
    load_professional_css()
    
    # Verificar conexión a base de datos
    if not test_connection():
        st.error("❌ No se pudo conectar con la base de datos. Verifica la configuración.")
        st.stop()
    
    # Header profesional
    render_professional_header()
    
    # Sidebar con filtros avanzados
    fecha_inicio, fecha_fin, cliente, origen, funnel = render_advanced_filters()
    
    if not fecha_inicio or not fecha_fin:
        st.stop()
    
    # Obtener datos
    with st.spinner("🔄 Cargando datos del dashboard..."):
        df_envios, df_respuestas, df_metricas = obtener_datos_dashboard(
            fecha_inicio, fecha_fin, cliente, origen, funnel
        )
    
    # Verificar que hay datos
    if df_metricas.empty:
        st.warning("⚠️ No se encontraron datos para los filtros seleccionados.")
        st.stop()
    
    # Renderizar secciones del dashboard
    render_executive_summary(df_metricas)
    render_hierarchical_view(df_metricas)  # Nueva vista jerárquica
    render_campaign_funnel(df_metricas)
    render_client_performance(df_metricas)
    render_origin_performance(df_metricas)
    render_temporal_analysis(df_envios, df_respuestas)
    render_alerts_and_insights(df_metricas)
    
    # Footer profesional
    st.markdown("---")
    st.markdown("""
    <div style="text-align: center; padding: 20px; color: rgba(255,255,255,0.8);">
        <p><strong>🚀 Outbound Marketing Dashboard</strong> - Powered by Streamlit</p>
        <p><em>Diseñado para maximizar el ROI de campañas de prospección</em></p>
    </div>
    """, unsafe_allow_html=True)

if __name__ == "__main__":
    main() 