
import type {
  ServiceSection,
} from "@/types/service";

export interface ServiceRegistryEntry {
  banner?: string;

  sections?: ServiceSection[];
}

export const SERVICE_REGISTRY: Record<string, ServiceRegistryEntry> = {
  'full-home-cleaning': {
    banner: '/images/banners/full-home-cleaning.svg',

    sections: [
      {
        id: 'apartment',
        title: 'Apartment',

        services: [
          {
            id: 'furnished-apartment',
            title: 'Furnished Apartment Cleaning',

            description: 'Complete cleaning for occupied furnished apartments.',
            duration: '2-3 hours',
            includes: [
              'Full home dusting',
              'Floor cleaning',
              'Bathroom cleaning',
              'Kitchen cleaning',
            ],

            excludes: ['Exterior window cleaning', 'Ceiling fan dismantling'],

            variants: [
              {
                name: '1 BHK',
                price: 1799,
              },
              {
                name: '2 BHK',
                price: 2499,
              },
              {
                name: '3 BHK',
                price: 3199,
              },
            ],
          },

          {
            id: 'unfurnished-apartment',
            title: 'Unfurnished Apartment Cleaning',

            description:
              'Thorough cleaning for empty or unfurnished apartments.',

            variants: [
              {
                name: '1 BHK',
                price: 1599,
              },
              {
                name: '2 BHK',
                price: 2299,
              },
              {
                name: '3 BHK',
                price: 2999,
              },
            ],
          },

          {
            id: 'regular-home',
            title: 'Regular Home Cleaning',

            description:
              'Routine home cleaning for apartments and residential homes.',

            duration: '2-3 hours',

            includes: [
              'Dusting',
              'Floor cleaning',
              'Bathroom cleaning',
              'Kitchen surface cleaning',
            ],

            excludes: ['Exterior window cleaning', 'Heavy stain restoration'],

            variants: [
              {
                name: '1 BHK',
                price: 799,
              },
              {
                name: '2 BHK',
                price: 999,
              },
              {
                name: '3 BHK',
                price: 1199,
              },
            ],
          },
        ],
      },

      {
        id: 'villa',
        title: 'Villa',

        services: [
          {
            id: 'empty-villa',
            title: 'Empty Villa Cleaning',

            description:
              'Detailed cleaning for vacant villas before move-in or after vacancy.',

            variants: [
              {
                name: 'Small Villa',
                price: 3499,
              },
              {
                name: 'Medium Villa',
                price: 4499,
              },
              {
                name: 'Large Villa',
                price: 5499,
              },
            ],
          },

          {
            id: 'occupied-villa',
            title: 'Occupied Villa Cleaning',

            description:
              'Complete cleaning for occupied villas with attention to living spaces and high-use areas.',
            variants: [
              {
                name: 'Small Villa',
                price: 3999,
              },
              {
                name: 'Medium Villa',
                price: 4999,
              },
              {
                name: 'Large Villa',
                price: 5999,
              },
            ],
          },
        ],
      },

      {
        id: 'post-construction',
        title: 'Post Construction',

        services: [
          {
            id: 'new-apartment',
            title: 'New Apartment Full Cleaning',

            description:
              'Detailed cleaning for newly constructed or renovated apartments.',
            variants: [
              {
                name: '1 BHK',
                price: 2199,
              },
              {
                name: '2 BHK',
                price: 2999,
              },
              {
                name: '3 BHK',
                price: 3799,
              },
            ],
          },

          {
            id: 'new-bungalow',
            title: 'New Bungalow Duplex Cleaning',

            description:
              'Detailed post-construction cleaning for new bungalow and duplex properties.',
            variants: [
              {
                name: 'Small',
                price: 5999,
              },
              {
                name: 'Medium',
                price: 6999,
              },
              {
                name: 'Large',
                price: 7999,
              },
            ],
          },
        ],
      },
    ],
  },

  'bathroom-cleaning': {
    banner: '/images/banners/bathroom-cleaning.svg',

    sections: [
      {
        id: 'bathroom',
        title: 'Bathroom Cleaning',

        services: [
          {
            id: 'standard-bathroom-cleaning',
            title: 'Standard Bathroom Cleaning',

            description:
              'Detailed bathroom cleaning including tiles, toilet, fittings and surfaces.',
            variants: [
              {
                name: '1 Bathroom',
                price: 499,
              },
              {
                name: '2 Bathrooms',
                price: 799,
              },
              {
                name: '3 Bathrooms',
                price: 1099,
              },
            ],
          },
        ],
      },
    ],
  },

  'kitchen-cleaning': {
    banner: '/images/banners/kitchen-cleaning.svg',

    sections: [
      {
        id: 'kitchen',
        title: 'Kitchen Cleaning',

        services: [
          {
            id: 'standard-kitchen-cleaning',
            title: 'Kitchen Cleaning',

            description:
              'Kitchen cleaning focused on grease, tiles, countertops and accessible surfaces.',
            variants: [
              {
                name: 'Standard Kitchen',
                price: 799,
              },
            ],
          },
        ],
      },
    ],
  },

  'sofa-cleaning': {
    banner: '/images/banners/sofa-cleaning.svg',

    sections: [
      {
        id: 'sofa',
        title: 'Sofa Cleaning',

        services: [
          {
            id: 'standard-sofa-cleaning',
            title: 'Sofa Cleaning',

            description:
              'Professional sofa cleaning with vacuuming, shampooing and stain treatment.',
            variants: [
              {
                name: 'Standard',
                price: 999,
              },
            ],
          },
        ],
      },
    ],
  },

  'cockroach-control': {
    banner: '/images/banners/cockroach-control.svg',

    sections: [
      {
        id: 'cockroach',
        title: 'Cockroach Control',

        services: [
          {
            id: 'standard-cockroach-control',
            title: 'Cockroach Control',

            description:
              'Targeted cockroach control treatment for residential properties.',
            variants: [
              {
                name: 'Standard Treatment',
                price: 699,
              },
            ],
          },
        ],
      },
    ],
  },

  'termite-control': {
    banner: '/images/banners/termite-control.svg',

    sections: [
      {
        id: 'termite',
        title: 'Termite Control',

        services: [
          {
            id: 'standard-termite-control',
            title: 'Termite Control',

            description:
              'Residential termite inspection and targeted treatment.',
            variants: [
              {
                name: 'Standard Treatment',
                price: 1499,
              },
            ],
          },
        ],
      },
    ],
  },
};


