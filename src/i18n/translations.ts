export type Language = 'en' | 'es';

type NestedDictionary = {
  [key: string]: string | NestedDictionary;
};

export const translations: Record<Language, NestedDictionary> = {
  en: {
    duration: {
      ready: 'You have everything!',
      week_one: '~1 week',
      weeks_multiple: '~{{count}} weeks',
      month_one: '~1 month',
      months_multiple: '~{{count}} months',
      and_week_one: ' and 1 week',
      and_weeks_multiple: ' and {{count}} weeks'
    },
    app: {
      loading: {
        deciphering: 'Deciphering...',
      }
    },
    layout: {
      footer: {
        not_affiliated: 'Not affiliated with Wizards of the Coast.',
        terms: 'Terms of Service',
        privacy: 'Privacy Policy',
        discord: 'Discord Support'
      }
    },
    rarity: {
      common: 'Common',
      uncommon: 'Uncommon',
      rare: 'Rare',
      mythic: 'Mythic'
    },
    importDeck: {
      hero: {
        description: 'Copy your Magic Arena deck to Analyze and Predict How Much Time You Need To Complete It Based On Your Current Cards.'
      },
      tabs: {
        mainDeck: 'Main Deck',
        sideboard: 'Sideboard',
        considering: 'Considering'
      },
      editor: {
        importExample: 'Import Example',
        placeholder: '4 Emberheart Challenger (BLB) 133\n1 Steal the Show (SOS) 130',
        formatRequired: 'MTGA Format Required',
      },
      status: {
        processing: 'Processing {{loaded}} of {{total}}',
        pasteFormat: 'Paste a deck list in MTGA format',
        parsing: 'Parsing list...',
        noValidCards: 'No valid cards found. Check MTGA format.',
        queryingScryfall: 'Querying Scryfall...',
        loadingCards: 'Loading cards...',
        illegalStandard: 'is not legal in Standard',
        notFound: 'Not found in Scryfall:',
        networkError: 'Network error:'
      },
      actions: {
        clear: 'Clear',
        cancel: 'Cancel',
        loadDeck: 'Load Deck',
        consulting: 'Consulting...'
      },
      cards: {
        loaded: 'Loaded Cards',
        unique: 'Unique',
        standardLegal: 'Standard Legal',
        illegalStandard: 'Illegal in Standard',
        ownership: 'Ownership:'
      },
      config: {
        title: 'Progress Configuration',
        wildcards: 'Wildcards in Tome',
        currentGold: 'Current Gold',
        playProfile: 'Play Profile',
        hoursPerDay: 'Hours per day:',
        daysPerWeek: 'Days per week:',
        options: {
          min30: '30 min',
          hour1: '1 hour',
          hour2: '2 hours',
          hour3: '3+ hours',
          mon: 'M', tue: 'T', wed: 'W', thu: 'T', fri: 'F', sat: 'S', sun: 'S'
        },
        calculate: 'Plot Roadmap',
        calculating: 'Calculating...'
      },
      diagnostics: {
        title: 'Deck Diagnostics',
        cardsDetected: 'Cards Detected',
        formatValidity: 'Format Validity',
        pending: 'Pending',
        invalid: 'Invalid',
        valid: 'Valid',
        expectedCost: 'Expected Wildcard Cost',
        didYouKnow: 'Did You Know',
        tip: 'You can analyze your wildcard requirements instantly. Ensure your deck format matches MTGA exports for maximum accuracy.'
      }
    },
    results: {
      empty: {
        message: 'The scroll is blank. Begin your reading.',
        start: 'Start'
      },
      header: {
        title: 'Roadmap',
        subtitle: 'The projected path to complete your deck'
      },
      stats: {
        completed: 'Completed',
        estimatedTime: 'Estimated Time',
        packsNeeded: 'Packs Needed',
        gold: 'GOLD'
      },
      wildcards: {
        missing: 'Missing Wildcards',
        missingLabel: 'Missing',
        req: 'REQ:',
        own: 'OWN:',
        mythicWarning: 'Mythic Rarity Warning',
        mythicWarningDesc: 'Mythic wildcards do not have a guaranteed cycle (approx. 1 every 72 packs). The projection is conservative; you might need to open more packs or use gems.'
      },
      schedule: {
        title: 'Acquisition Schedule'
      },
      actions: {
        modifyInventory: 'Modify Inventory',
        discardAnalysis: 'Discard Analysis'
      }
    },
    budgetView: {
      empty: {
        message: 'No budget suggestions available.',
        back: '← Back to Results'
      },
      header: {
        title: 'Budget Version',
        subtitle: 'More accessible alternatives to mitigate deck cost'
      },
      savings: {
        savedWildcards: 'Wildcards Saved',
        newTime: 'New estimated time:',
        originalTime: 'Original:'
      },
      substitutions: {
        title: 'Suggested Substitutions',
        saves: 'Saves {{count}}'
      },
      disclaimer: {
        title: 'Budget Considerations',
        message: 'These substitutions are suggestive and could alter the original synergy. They are selected by type and cost, but effectiveness in the current meta may vary.'
      },
      cost: {
        title: 'Modified Cost'
      },
      roadmap: {
        title: 'New Roadmap'
      },
      actions: {
        back: '← Back to Results',
        discard: '✕ Discard Analysis'
      }
    },
    roadmapTimeline: {
      success: {
        title: 'Goal Reached!',
        message: 'You do not need additional wildcards for this deck.'
      },
      labels: {
        finalWeek: 'FINAL WEEK',
        weekQuests: 'WEEK {{week}} / QUESTS',
        perDay: '/day',
        wins: 'WINS',
        perWeek: '/wk',
        gold: 'GOLD',
        packs: 'PACKS'
      }
    },
    wildcardCounter: {
      missing: 'Missing',
      req: 'Req:',
      own: 'Own:'
    },
    cardRow: {
      illegal: 'Not legal',
      sb: 'SB',
      ownership: 'Ownership:'
    }
  },
  es: {
    duration: {
      ready: '¡Ya tienes todo!',
      week_one: '~1 semana',
      weeks_multiple: '~{{count}} semanas',
      month_one: '~1 mes',
      months_multiple: '~{{count}} meses',
      and_week_one: ' y 1 semana',
      and_weeks_multiple: ' y {{count}} semanas'
    },
    app: {
      loading: {
        deciphering: 'Descifrando...',
      }
    },
    layout: {
      footer: {
        not_affiliated: 'No afiliado con Wizards of the Coast.',
        terms: 'Términos de Servicio',
        privacy: 'Política de Privacidad',
        discord: 'Soporte en Discord'
      }
    },
    rarity: {
      common: 'Común',
      uncommon: 'Infrecuente',
      rare: 'Rara',
      mythic: 'Mítica'
    },
    importDeck: {
      hero: {
        description: 'Copia tu mazo de Magic Arena para Analizar y Predecir Cuanto Tiempo Necesitas Para Completarlo Según tus Cartas Actuales.'
      },
      tabs: {
        mainDeck: 'Main Deck',
        sideboard: 'Sideboard',
        considering: 'Considering'
      },
      editor: {
        importExample: 'Importar Ejemplo',
        placeholder: '4 Emberheart Challenger (BLB) 133\n1 Steal the Show (SOS) 130',
        formatRequired: 'Formato MTGA Requerido',
      },
      status: {
        processing: 'Procesando {{loaded}} de {{total}}',
        pasteFormat: 'Pega una lista de mazo en formato MTGA',
        parsing: 'Parseando lista...',
        noValidCards: 'No se encontraron cartas válidas. Verifica el formato MTGA.',
        queryingScryfall: 'Consultando Scryfall...',
        loadingCards: 'Cargando cartas...',
        illegalStandard: 'no es legal en Standard',
        notFound: 'No encontrada en Scryfall:',
        networkError: 'Error de red:'
      },
      actions: {
        clear: 'Limpiar',
        cancel: 'Cancel',
        loadDeck: 'Cargar Mazo',
        consulting: 'Consultando...'
      },
      cards: {
        loaded: 'Cartas Cargadas',
        unique: 'Únicas',
        standardLegal: 'Legal en Standard',
        illegalStandard: 'Ilegal en Standard',
        ownership: 'Propiedad:'
      },
      config: {
        title: 'Configuración de Progreso',
        wildcards: 'Wildcards en el Tomo',
        currentGold: 'Oro Actual',
        playProfile: 'Perfil de Juego',
        hoursPerDay: 'Horas por día:',
        daysPerWeek: 'Días a la semana:',
        options: {
          min30: '30 min',
          hour1: '1 hora',
          hour2: '2 horas',
          hour3: '3+ horas',
          mon: 'L', tue: 'M', wed: 'X', thu: 'J', fri: 'V', sat: 'S', sun: 'D'
        },
        calculate: 'Trazar Hoja de Ruta',
        calculating: 'Calculando...'
      },
      diagnostics: {
        title: 'Diagnóstico de Mazo',
        cardsDetected: 'Cartas Detectadas',
        formatValidity: 'Validez del Formato',
        pending: 'Pendiente',
        invalid: 'Inválido',
        valid: 'Válido',
        expectedCost: 'Costo Esperado de Wildcards',
        didYouKnow: '¿Sabías que...?',
        tip: 'Puedes analizar tus requerimientos de wildcards al instante. Asegúrate de que tu formato coincida con las exportaciones de MTGA para mayor precisión.'
      }
    },
    results: {
      empty: {
        message: 'El pergamino está en blanco. Inicia tu lectura.',
        start: 'Comenzar'
      },
      header: {
        title: 'Hoja de Ruta',
        subtitle: 'El camino proyectado para completar tu mazo'
      },
      stats: {
        completed: 'Completado',
        estimatedTime: 'Tiempo Estimado',
        packsNeeded: 'Sobres Necesarios',
        gold: 'ORO'
      },
      wildcards: {
        missing: 'Comodines Faltantes',
        missingLabel: 'Faltantes',
        req: 'REQ:',
        own: 'OWN:',
        mythicWarning: 'Advertencia de Rareza Mítica',
        mythicWarningDesc: 'Las wildcards míticas no tienen un ciclo garantizado (aprox. 1 cada 72 sobres). La proyección es conservadora; podrías necesitar abrir más sobres o usar gemas.'
      },
      schedule: {
        title: 'Cronograma de Adquisición'
      },
      actions: {
        modifyInventory: 'Modificar Inventario',
        discardAnalysis: 'Descartar Análisis'
      }
    },
    budgetView: {
      empty: {
        message: 'No hay sugerencias budget disponibles.',
        back: '← Volver a Resultados'
      },
      header: {
        title: 'Versión Budget',
        subtitle: 'Alternativas más accesibles para mitigar el costo del mazo'
      },
      savings: {
        savedWildcards: 'Comodines Ahorrados',
        newTime: 'Nuevo tiempo estimado:',
        originalTime: 'Original:'
      },
      substitutions: {
        title: 'Sustituciones Sugeridas',
        saves: 'Ahorra {{count}}'
      },
      disclaimer: {
        title: 'Consideraciones Budget',
        message: 'Estas sustituciones son orientativas y podrían alterar la sinergia original. Se seleccionan por tipo y coste, pero la eficacia en el meta actual puede variar.'
      },
      cost: {
        title: 'Costo Modificado'
      },
      roadmap: {
        title: 'Nueva Hoja de Ruta'
      },
      actions: {
        back: '← Volver a Resultados',
        discard: '✕ Descartar Análisis'
      }
    },
    roadmapTimeline: {
      success: {
        title: '¡Objetivo Alcanzado!',
        message: 'No necesitas comodines adicionales para este mazo.'
      },
      labels: {
        finalWeek: 'SEMANA FINAL',
        weekQuests: 'SEMANA {{week}} / MISIONES',
        perDay: '/día',
        wins: 'VICTORIAS',
        perWeek: '/sem',
        gold: 'ORO',
        packs: 'SOBRES'
      }
    },
    wildcardCounter: {
      missing: 'Faltantes',
      req: 'Req:',
      own: 'Own:'
    },
    cardRow: {
      illegal: 'No legal',
      sb: 'SB',
      ownership: 'Propiedad:'
    }
  }
};
