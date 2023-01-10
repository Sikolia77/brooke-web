//import images card 1
import satellite from "../imgs/imagery.jpg";
import basemap from "../imgs/basemap.jpg";
import topomap from "../imgs/topomap.jpg";
import vectordata from "../imgs/vectordata.png";

import th1 from "../imgs/th1.jpg";
import th2 from "../imgs/th2.jpg";
import th3 from "../imgs/th3.jpg";
import th4 from "../imgs/th4.jpg";

import tp1 from "../imgs/tp1.png";
import tp2 from "../imgs/tp2.png";
import tp3 from "../imgs/tp3.jpg";
import tp4 from "../imgs/tp4.png";

import rs1 from "../imgs/rs1.png";
import rs2 from "../imgs/rs2.jpg";
import rs3 from "../imgs/rs3.jpg";
import rs4 from "../imgs/rs4.jpg";

import v1 from "../imgs/v1.png";
import v2 from "../imgs/v2.png";
import v3 from "../imgs/v3.jpg";
import v4 from "../imgs/v4.png";

import thematicMap from "../imgs/th1.jpg";
import rasterMap from "../imgs/rs1.png";
import vectorMap from "../imgs/v1.png";
import topoMap from "../imgs/tp3.jpg";

const myData = [
  {
    title: "Brooke East Africa",
    subtitle: "GIS Portal",
    cat: "data",
    p: `Brooke E.A GIS Portal is a repository for all the Geo-referenced data sets of Brooke East Africa. It displays various types of data in interactive maps overlayed on base maps.
                `,
    label: "View Data",
    imgs: [
      { image: satellite, txt: "Advocacy & Innovation" },
      { image: vectordata, txt: "Community Engagement" },
      { image: topomap, txt: "Animal Health" },
      { image: satellite, txt: "Communication" },
      { image: basemap, txt: "Partners" },
    ],
  },
  {
    title: "Brooke East Africa GIS Portal",
    subtitle: "Advocacy & Innovation",
    cat: "Advocacy & Innovation",
    p: `These types of maps portray the geographic pattern of a particular subject matter in a geographic area.`,
    label: "View Sample Maps",
    imgs: [
      { image: th1, txt: "Institutions/Collaborators" },
      { image: th2, txt: "Research" },
      { image: th3, txt: "Campaigns" },
      { image: th4, txt: "Conferences" },
      { image: th4, txt: "Community Actions" },
    ],
  },
  {
    title: "Brooke East Africa GIS Portal",
    subtitle: "Community Engagement",
    cat: "Community Engagement",
    p: `These types of map characterized by large-scale detail and quantitative representation of landmark features.`,
    label: "View Sample Maps",
    imgs: [
      { image: tp1, txt: "CBOs & Groups" },
      { image: tp2, txt: "CAWAs" },
      { image: tp3, txt: "Care Clubs" },
      { image: tp4, txt: "Livelihoods" },
      { image: tp4, txt: "Slaughter Houses" },
    ],
  },
  {
    title: "Brooke East Africa GIS Portal",
    subtitle: "Animal Health",
    cat: "Animal Health",
    p: `Earth observation involves gathering information about the Earth through remote sensing technologies`,
    label: "View/Download Data",
    imgs: [
      { image: rs1, txt: "Farriers" },
      { image: rs2, txt: "AHPs" },
      { image: rs3, txt: "Agrovets" },
      { image: rs4, txt: "Vet Institutions" },
      { image: rs4, txt: "Animal Health Facilities" },
    ],
  },
];

const categoriesData = [
  {
    title: "Innovation & Advocacy",
    subTitle: "Geographical patterns",
    description:
      "A thematic map is a type of map that portrays the geographic pattern of a particular subject matter in a geographic area.",
    image: thematicMap,
    link: "/category/Advocacy Innovation",
  },
  {
    title: "Animal Health",
    subTitle: "Animal Health",
    description:
      "A topographic map a type of map characterized by large-scale detail and quantitative representation of relief features, usually using contour lines, but historically using a variety of methods.",
    image: topoMap,
    link: "/category/Animal Health",
  },
  {
    title: "Community Engagement",
    subTitle: "Community Engagement",
    description:
      "Earth observation is the gathering of information about planet Earth's physical, chemical and biological systems via remote sensing technologies, usually involving satellites carrying imaging devices.",
    image: rasterMap,
    link: "/category/Community Engagement",
  },
];

export { myData, categoriesData };
