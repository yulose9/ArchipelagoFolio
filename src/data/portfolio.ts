import { Section } from '../types/Section';

export const portfolioSections: Section[] = [
  {
    id: 'about',
    title: 'About Me',
    content: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. 
    
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`,
    mapRegion: {
      name: 'Manila Bay',
      center: [120.9842, 14.5995],
      zoom: 11,
      bearing: 0,
      pitch: 45
    },
    animationConfig: {
      duration: 800,
      easing: 'easeInOut',
      delay: 200,
      scrollTrigger: {
        start: '0%',
        end: '25%'
      }
    },
    order: 1
  },
  {
    id: 'projects',
    title: 'Projects',
    content: `Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
    
    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.`,
    mapRegion: {
      name: 'Cebu',
      center: [123.8854, 10.3157],
      zoom: 10,
      bearing: 15,
      pitch: 50
    },
    animationConfig: {
      duration: 900,
      easing: 'easeOut',
      delay: 150,
      scrollTrigger: {
        start: '25%',
        end: '50%'
      }
    },
    order: 2
  },
  {
    id: 'skills',
    title: 'Skills',
    content: `At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.
    
    Similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.`,
    mapRegion: {
      name: 'Baguio',
      center: [120.5960, 16.4023],
      zoom: 12,
      bearing: -30,
      pitch: 40
    },
    animationConfig: {
      duration: 750,
      easing: 'easeInOut',
      delay: 100,
      scrollTrigger: {
        start: '50%',
        end: '75%'
      }
    },
    order: 3
  },
  {
    id: 'contact',
    title: 'Contact',
    content: `Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
    
    Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.`,
    mapRegion: {
      name: 'Davao',
      center: [125.6128, 7.0731],
      zoom: 11,
      bearing: 45,
      pitch: 35
    },
    animationConfig: {
      duration: 850,
      easing: 'anticipate',
      delay: 250,
      scrollTrigger: {
        start: '75%',
        end: '100%'
      }
    },
    order: 4
  }
];

export const getSectionById = (id: string): Section | undefined => {
  return portfolioSections.find(section => section.id === id);
};

export const getSectionsByOrder = (): Section[] => {
  return [...portfolioSections].sort((a, b) => a.order - b.order);
};