export interface Paper {
  title: string;
  venue: string;
  authors: string[];
  date: string;
  url: string;
  description: string;
  image: string;
}

export const papers: Paper[] = [
  {
    title: 'Inferring the Sensitivity of Wastewater Metagenomic Sequencing for Pathogen Early Detection',
    venue: 'The Lancet Microbe',
    authors: ['Simon Grimm', 'Jeff Kaufman', 'et al.'],
    date: '2025-10-14',
    url: 'https://www.thelancet.com/journals/lanmic/article/PIIS2666-5247(25)00115-6/fulltext',
    description: 'In this paper, we create a modelling framework that combines epidemiological data and metagenomic sequencing data to infer the sensitivity and cost of wastewater metagenomic sequencing for pathogen early detection.',
    image: '/img/lancet-microbe-fig1a.png',
  },
  {
    title: 'Indoor Air Sampling for Detection of Viral Nucleic Acids',
    venue: 'Journal of Aerosol Science',
    authors: ['Lennart Justen', 'Simon Grimm', 'Kevin Esvelt', 'Will Bradshaw'],
    date: '2025-02-27',
    url: 'https://www.sciencedirect.com/science/article/pii/S0021850225000266',
    description: 'In this review we examine the sources and composition of viral bioaerosols, evaluate the benefits and drawbacks of air sampling technologies, and lay out strategies for effective implementation of air sampling programs.',
    image: '/img/particle_concentration.png',
  },
];
