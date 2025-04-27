import code from '/public/images/FaceReading.png';
import game from '/public/images/game1.png';
import escape from '/public/images/escape5.png';
import converter from '/public/images/mp4toGif.png';
import robot from '/public/images/robot1.png';
import box from '/public/images/growingbox1.jpeg';
import vdesign from '/public/images/2ddesign1.png';
import visual1 from '/public/images/visual1.png';
import visual3 from '/public/images/visual3.png';
import robotarm2 from '/public/images/robotarm2.png';
import { StaticImageData } from 'next/image';

interface WorkData {
  img_url: string | StaticImageData; // Sta zowel string als StaticImageData toe
  id: string;
  external: boolean;
  year: string;
  category: string;
  width: number;
  height: number;
  url: string;
}

const works: WorkData[] = [
  {
    img_url: escape,
    id: "Game escaperoom",
    external: false,
    year: "2023",
    category: "3D design",
    width: 800 / 3,
    height: 550 / 3,
    url: "/works/escaperoom"
  },
  {
    img_url: converter,
    id: "MP4 to GIF",
    external: false,
    year: "2024",
    category: "code",
    width: 500 / 3,
    height: 500 / 3,
    url: "/works/converter"
  },
  {
    img_url: robot,
    id: "Unpredictable robot",
    external: false,
    year: "2024",
    category: "code",
    width: 800 / 3.3,
    height: 500 / 3.3,
    url: "/works/brobot"
  },
  {
    img_url: code,
    id: "Emotion detection",
    external: false,
    year: "2024",
    category: "Code",
    width: 800 / 3,
    height: 550 / 3,
    url: "/works/face"
  },
  {
    img_url: vdesign,
    id: "2D AI",
    external: false,
    year: "2022",
    category: "AI design",
    width: 400 / 3,
    height: 700 / 3,
    url: "/works/2ddesign"
  },
  {
    img_url: game,
    id: "Unwired",
    external: false,
    year: "2023",
    category: "3D design",
    width: 800 / 3,
    height: 550 / 3,
    url: "/works/immersive"
  },
  {
    img_url: box,
    id: "Hydrokit",
    external: false,
    year: "2022",
    category: "design",
    width: 800 / 3,
    height: 550 / 3,
    url: "/works/Growingbox"
  },
  {
    img_url: robotarm2,
    id: "6-DOF Robot Arm",
    external: false,
    year: "2025 -",
    category: "Robotics",
    width: 600 / 3,
    height: 600 / 3,
    url: "/works/6dofrobotarm"
  },
];

// Array omdraaien zonder de originele array te wijzigen
let worksReversed = [...works].reverse();

export { works, worksReversed };
