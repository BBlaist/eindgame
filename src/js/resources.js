import { ImageSource, Sound, Resource, Loader } from 'excalibur'

// Resources: verzamelt alle afbeeldingsbronnen die in het spel worden gebruikt
const Resources = {
    Powerup: new ImageSource('images/powerup.png'),
    Enemy: new ImageSource('images/enemy.png'),
    Floor: new ImageSource('images/floor2.jpg'),
    Samus: new ImageSource('images/samus.png'),
    Background1: new ImageSource('images/background1.png'),
    Background2: new ImageSource('images/background2.png'),
    Background3: new ImageSource('images/background3.png'),
    Background4: new ImageSource('images/background4.png'),
}

const resourceArray = []
for (const key in Resources) {
    resourceArray.push(Resources[key])
}

// ResourceLoader: laadt alle resources vooraf in voordat het spel start
const ResourceLoader = new Loader(resourceArray)

export { Resources, ResourceLoader }