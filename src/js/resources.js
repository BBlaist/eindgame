import { ImageSource, Loader } from 'excalibur'

// Resources: verzamelt alle afbeeldingsbronnen die in het spel worden gebruikt
// Met de URL wrapper snapt Vite exact hoe de assets verplaatst moeten worden in de productiebuild.
const Resources = {
    Powerup: new ImageSource(new URL('/images/powerup.png', import.meta.url).href),
    Enemy: new ImageSource(new URL('/images/enemy.png', import.meta.url).href),
    Floor: new ImageSource(new URL('/images/floor2.jpg', import.meta.url).href),
    Samus: new ImageSource(new URL('/images/samus.png', import.meta.url).href),
    Background1: new ImageSource(new URL('/images/background1.png', import.meta.url).href),
    Background2: new ImageSource(new URL('/images/background2.png', import.meta.url).href),
    Background3: new ImageSource(new URL('/images/background3.png', import.meta.url).href),
    Background4: new ImageSource(new URL('/images/background4.png', import.meta.url).href),
}

const resourceArray = []
for (const key in Resources) {
    resourceArray.push(Resources[key])
}

// ResourceLoader: laadt alle resources vooraf in voordat het spel start
const ResourceLoader = new Loader(resourceArray)

export { Resources, ResourceLoader }