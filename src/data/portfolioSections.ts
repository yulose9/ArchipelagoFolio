import { Section as PortfolioSection } from '@/types/Section';
import { MapRegion } from '@/types/MapRegion';

const defaultAnimation = {
  duration: 1000,
  easing: 'ease-in-out',
  delay: 0,
  scrollTrigger: {
    start: 'top 80%',
    end: 'bottom 20%',
  },
};

export const PORTFOLIO_SECTIONS: PortfolioSection[] = [
    {
        id: 'hero',
        title: 'Welcome',
        content: 'Full-Stack Developer & Digital Innovator',
        order: 0,
        mapRegion: {
            name: 'Makati Zuellig Building',
            center: [121.0280, 14.5547], // Makati CBD area near Zuellig Building
            zoom: 21,
            pitch: 80,
            bearing: 45,
        },
        animationConfig: {
            duration: 0.8,
            delay: 0.2,
            easing: 'easeOut',
            scrollTrigger: {
                start: 'top 80%',
                end: 'bottom 20%'
            }
        }
    },
    {
        id: 'about',
        title: 'About Me',
        content: 'Passionate about creating innovative solutions that bridge technology and user experience.',
        order: 1,
        mapRegion: {
            name: 'Manila Bay Area',
            center: [120.9842, 14.5995], // Manila Bay with city skyline
            zoom: 20,
            pitch: 78,
            bearing: 120,
        },
        animationConfig: {
            duration: 1.0,
            delay: 0.3,
            easing: 'easeInOut',
            scrollTrigger: {
                start: 'top 80%',
                end: 'bottom 20%'
            }
        }
    },
    {
        id: 'projects',
        title: 'Featured Projects',
        content: 'A showcase of my recent work in web development, mobile apps, and digital experiences.',
        order: 2,
        mapRegion: {
            name: 'Boracay Island',
            center: [121.9270, 11.9674], // Boracay White Beach area
            zoom: 21,
            pitch: 75,
            bearing: 200,
        },
        animationConfig: {
            duration: 0.9,
            delay: 0.1,
            easing: 'easeOut',
            scrollTrigger: {
                start: 'top 80%',
                end: 'bottom 20%'
            }
        }
    },
    {
        id: 'skills',
        title: 'Technical Skills',
        content: 'Expertise in modern web technologies, cloud platforms, and development methodologies.',
        order: 3,
        mapRegion: {
            name: 'Cebu IT Park',
            center: [123.9066, 10.3181], // Cebu IT Park business district
            zoom: 21,
            pitch: 80,
            bearing: 270,
        },
        animationConfig: {
            duration: 0.7,
            delay: 0.4,
            easing: 'easeInOut',
            scrollTrigger: {
                start: 'top 80%',
                end: 'bottom 20%'
            }
        }
    },
    {
        id: 'contact',
        title: 'Get In Touch',
        content: 'Let\'s collaborate and create something amazing together.',
        order: 4,
        mapRegion: {
            name: 'Clark Pampanga',
            center: [120.5586, 15.1353], // Clark Freeport Zone, Pampanga
            zoom: 20,
            pitch: 75,
            bearing: 315,
        },
        animationConfig: {
            duration: 1.2,
            delay: 0.2,
            easing: 'easeOut',
            scrollTrigger: {
                start: 'top 80%',
                end: 'bottom 20%'
            }
        }
    }
];