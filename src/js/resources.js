import { ImageSource, Sound, Resource, Loader } from 'excalibur'

const Resources = {
    Bird: new ImageSource('images/bird.png'),
    Floor: new ImageSource('images/floor.jpg'),
    Hollow: new ImageSource('images/hollow.png'),
    Background1: new ImageSource('images/background1.jpg'),
}

const resourceArray = []
for (const key in Resources) {
    resourceArray.push(Resources[key])
}

const ResourceLoader = new Loader(resourceArray)

export { Resources, ResourceLoader }