import {apiSettings} from "./react-utils/settings";
import {convertIdToUrl} from './react-utils/utils'

export const settings = {
  ...apiSettings,
  defaultCountryUrl: apiSettings.apiResourceEndpoints.countries + '1/',
  websiteId: 2,
  ownWebsiteUrl: convertIdToUrl(2, 'websites'),
  shortDescriptionPurposeId: 2,
  defaultDaysForOrdering: 3,
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
        label: 'Juegos 3D',
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
        label: '3DMark 11',
        field: 'gpu_tdmark_11_score',
        maxValue: 25000
      },
      {
        label: '3DMark Cloud Gate',
        field: 'gpu_tdmark_cloud_gate_score',
        maxValue: 35000
      },
      {
        label: '3DMark Fire Strike',
        field: 'gpu_tdmark_fire_strike_score',
        maxValue: 20000
      }
    ],
    3: [
      {
        label: 'PCMark 7',
        field: 'pcmark_7_score',
        maxValue: 6000
      },
      {
        label: 'PCMark 8',
        field: 'pcmark_8_score',
        maxValue: 5500
      },
      {
        label: 'Passmark',
        field: 'passmark_score',
        maxValue: 23000
      }
    ],
    6: [
      {
        label: 'Rendimiento general',
        field: 'soc_basemark_os_score',
        maxValue: 5000
      },
      {
        label: 'Velocidad en juegos 3D',
        field: 'soc_gpu_gfx_bench_score',
        maxValue: 2500
      }
    ],
    14: [
      {
        label: 'Aplicaciones (BaseMark OS)',
        field: 'soc_basemark_os_score',
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
      ordering: "offer_price",
      filters: {
        size_0: "size_family_id",
        resolution_0: "resolution_id",
        refresh_rate_0: "refresh_rate_id"
      }
    }
  },
  categoryBrowseParameters: {
    6: {
      bucketField: 'base_model_bundle_internal_storage_ram_key',
      bucketProductLabelField: 'color_unicode'
    },
    14: {
      bucketField: 'base_model_bundle_internal_storage_cell_connectivity_key',
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
          label: 'Capacidad',
          labelField: 'internal_storage_unicode',
          orderingField: 'internal_storage_value'
        },
        {
          label: 'Ram',
          labelField: 'ram_unicode',
          orderingField: 'ram_value'
        },
        {
          label: 'Bundle',
          labelField: 'bundle_unicode',
          orderingField: 'bundle_unicode'
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
        },
        {
          label: 'Bundle',
          labelField: 'bundle_unicode',
          orderingField: 'bundle_unicode'
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
    {
      label: "Básico",
      labelXS:"Bas.",
      intelBudget: 3181,
      amdBudget: 3182
    },
    {
      label: "Medio",
      labelXS: "Medio",
      intelBudget: 12337,
      amdBudget: 12338
    },
    {
      label: "Alto",
      labelXS: "Alto",
      intelBudget: 12339,
      amdBudget: 12340
    },
    {
      label: "Avanzado",
      labelXS: "Avanz.",
      intelBudget: 12341,
      amdBudget: 12342
    },
  ],
};
