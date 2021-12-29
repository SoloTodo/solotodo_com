import {apiSettings} from "./react-utils/settings";
import {convertIdToUrl} from './react-utils/utils'

export const settings = {
  ...apiSettings,
  defaultCountryUrl: apiSettings.apiResourceEndpoints.countries + '1/',
  countryCode: 'cl',
  websiteId: 2,
  ownWebsiteUrl: convertIdToUrl(2, 'websites'),
  domain: 'https://www.solotodo.cl',
  shortDescriptionPurposeId: 2,
  categoryBrowseResultsPerPage: 12,
  disqusShortName: 'solotodo3',
  googleAnalyticsId: 'UA-11970222-11',
  lgAdWordsConversionId: 'AW-3270351152',
  defaultDaysForPricingHistory: 20,
  facebookAppId: '567644670062006',
  // customIp: '179.5.217.178',
  benchmarkCategories: {
    1: [
      {
        label: 'Aplicaciones',
        field: 'score_general',
        maxValue: 1000
      },
      {
        label: 'Gaming',
        field: 'score_games',
        maxValue: 1000
      },
      {
        label: 'Movilidad',
        field: 'score_mobility',
        maxValue: 1000
      }
    ],
    2: [
      {
        label: '3DMark Time Spy',
        field: 'gpu_tdmark_time_spy_score',
        maxValue: 13000
      },
      {
        label: '3DMark Port Royal (Ray tracing)',
        field: 'gpu_tdmark_port_royal_score',
        maxValue: 8900
      },
      {
        label: '3DMark VR Room Orange (VR)',
        field: 'gpu_tdmark_vr_room_orange_score',
        maxValue: 11000
      }
    ],
    3: [
      {
        label: 'PCMark 10',
        field: 'pcmark_10_score',
        maxValue: 7000
      },
      {
        label: 'Cinebench R20 (Multi core)',
        field: 'cinebench_r20_multi_score',
        maxValue: 14000
      },
      {
        label: 'Passmark',
        field: 'passmark_score',
        maxValue: 60000
      }
    ],
    6: [
      {
        label: 'Rendimiento general',
        field: 'general_score',
        maxValue: 1000
      },
      {
        label: 'Rendimiento en gaming',
        field: 'soc_gpu_gfx_bench_score',
        maxValue: 10000
      }
    ],
    14: [
      {
        label: 'Rendimiento general',
        field: 'general_score',
        maxValue: 1000
      },
      {
        label: 'Juegos (GFX Bench)',
        field: 'soc_gpu_gfx_bench_score',
        maxValue: 1000
      }
    ]
  },
  alternativeProductsParameters: {
    1: {
      ordering: "-score_general",
    },
    4: {
      ordering: "offer_price_usd",
      filters: {
        size_min: "size_family_id",
        resolution_min: "resolution_id",
        refresh_rate_min: "refresh_rate_id"
      }
    }
  },
  categoryBrowseParameters: {
    6: {
      bucketField: 'base_model_internal_storage_ram_key',
      bucketProductLabelField: 'color_unicode'
    },
    14: {
      bucketField: 'base_model_internal_storage_cell_connectivity_key',
      bucketProductLabelField: 'color_unicode'
    }
  },
  bucketCategories: {
    6: {
      fields: 'base_model_id',
      axes: [
        {
          label: 'Color',
          labelField: 'color_unicode',
          orderingField: 'color_unicode'
        },
        {
          label: 'Capacidad / RAM',
          labelField: 'storage_and_ram',
          orderingField: 'internal_storage_value'
        }
      ],
    },
    14: {
      fields: 'base_model_id',
      axes: [
        {
          label: 'Color',
          labelField: 'color_unicode',
          orderingField: 'color_unicode'
        },
        {
          label: 'Capacidad',
          labelField: 'internal_storage_unicode',
          orderingField: 'internal_storage_value'
        },
        {
          label: 'Conectividad celular',
          labelField: 'cell_connectivity_unicode',
          orderingField: 'cell_connectivity_unicode'
        }
      ],
    },
    3: {
      fields: 'core_architecture_id,line_id',
      axes: [
        {
          label: 'Modelo',
          labelField: 'unicode',
          orderingField: 'unicode',
        }
      ]
    },
    48: {
      fields: 'base_model_id',
      axes: [
        {
          label: 'Color',
          labelField: 'color_unicode',
          orderingField: 'color_unicode'
        },
      ]
    },
    2: {
      fields: 'brand_id,gpu_id',
      axes: [
        {
          label: 'Memoria',
          labelField: 'memory_quantity_unicode',
          orderingField: 'memory_quantity_value'
        },
        {
          label: 'Modelo',
          labelField: 'commercial_name',
          orderingField: 'commercial_name',
          directLink: true
        },
      ]
    },
  },
  frontPageBudgets: [
      { label: "Básico",
        labelXS:"Bas.",
        intelBudget: 3181,
        amdBudget: 3182 },
      { label: "Medio",
        labelXS: "Medio",
        intelBudget: 12337,
        amdBudget: 12338 },
      { label: "Alto",
        labelXS: "Alto",
        intelBudget: 12339,
        amdBudget: 12340 },
      { label: "Avanzado",
        labelXS: "Avanz.",
        intelBudget: 12341,
        amdBudget: 12342
      }]
};
