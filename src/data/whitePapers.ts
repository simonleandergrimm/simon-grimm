export interface WhitePaper {
  title: string;
  authors: string[];
  date: string;
  url: string;
  description: string;
  image: string;
}

export const whitePapers: WhitePaper[] = [
  {
    title: 'Estimating the Sensitivity of Wastewater Metagenomic Sequencing using Nasal Swabs',
    authors: ['Simon Grimm', 'Dan Rice', 'Mike McLaren'],
    date: '2025-06-08',
    url: 'https://naobservatory.org/blog/swab-based-p2ra/',
    description: 'Using sequencing data from both NAO\'s wastewater and swab sampling system, we estimate the sensitivity of wastewater metagenomic sequencing for pathogen detection.',
    image: '/img/swab-ww-estimation.svg',
  },
  {
    title: 'Comparing Sampling Strategies for Early Detection of Stealth Biothreats',
    authors: ['Will Bradshaw', 'Simon Grimm'],
    date: '2024-02-19',
    url: 'https://naobservatory.org/reports/comparing-sampling-strategies-for-early-detection-of-stealth-biothreats',
    description: 'Will Bradshaw and I outline how to think about the benefits and drawbacks of different sampling strategies for the early detection of asymptomatically spreading pathogens.',
    image: '/img/novelty_detection.png',
  },
  {
    title: 'Investigating the Sensitivity of Pooled Swab Sampling for Pathogen Early Detection',
    authors: ['Simon Grimm', 'Will Bradshaw'],
    date: '2024-07-01',
    url: 'https://naobservatory.org/blog/investigating-the-sensitivity-of-pooled-swab-sampling-for-pathogen-early-detection',
    description: 'Will Bradshaw and I take existing swab sample sequencing data, adjust it to better represent samples from non-hospital settings, and use the results to model the likely sensitivity of a swab-sampling and metagenomics-based early detection system.',
    image: '/img/swab_sensitivity.svg',
  },
];
