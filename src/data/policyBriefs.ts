export interface PolicyBrief {
  title: string;
  authors: string[];
  date: string;
  url: string;
  description: string;
  image: string;
}

export const policyBriefs: PolicyBrief[] = [
  {
    title: 'Scaling US Pathogen Detection',
    authors: ['Simon Grimm', 'Lennart Justen', 'Jeff Kaufman'],
    date: '2025-09-23',
    url: 'https://naobservatory.org/blog/biothreat_radar',
    description: 'Here we model how the US could dramatically scale up its pathogen detection capabilities at a funding level of $52M/year. The system design is both informed by modeling work, and NAO\'s extensive experience piloting metagenomic biosurveillance.',
    image: '/img/at-scale-surveillance.svg',
  },
  {
    title: 'Accelerating the Defensive Deployment of Pathogen Sequencing',
    authors: ['Simon Grimm'],
    date: '2025-05-06',
    url: 'https://www.rebuilding.tech/posts/accelerating-the-defensive-deployment-of-pathogen-sequencing',
    description: 'For the Techno-Industrial Policy Playbook\u2014a collaboration by IFP, FAI, American Compass, and NAIA\u2014I provide policy recommendations on how the US government can accelerate both environmental and clinical surveillance of new pathogen outbreaks.',
    image: '/img/techno-industrial-playbook.png',
  },
  {
    title: 'Scaling Pathogen Detection with Metagenomics',
    authors: ['Simon Grimm'],
    date: '2025-08-11',
    url: 'https://ifp.org/scaling-pathogen-detection-with-metagenomics',
    description: 'For the Institute for Progress\' Launch Sequence series, I describe how government deployment of metagenomic sequencing, combined with the increased use of frontier AI for data analysis, can identify both known and novel pathogens.',
    image: '/img/genome-cost.svg',
  },
];
