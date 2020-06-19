import React from 'react';
import {Image} from 'react-bootstrap';
import Logoimg from './logoimg.png';

class ImageLogo extends React.Component{
    render(){
        return(
            <div id = "img">
                <Image src = {Logoimg} alt = "logoimg" width = "70px" height = "70px"/>
            </div>
        );
    }
}

export default ImageLogo;