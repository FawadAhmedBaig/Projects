import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import SunnyIcon from '@mui/icons-material/Sunny';
import ThunderstormIcon from '@mui/icons-material/Thunderstorm';

import "./InfoBox.css" 

export default function InfoBox({info}){

    return (
    <div className="InfoBox">
        <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        alt="green iguana"
        height="140"
        image= {info.humidity>80? "/assets/rainy.jpg": info.temp>20? "/assets/sunny.jpg" : "/assets/winter.jpg"}
      />
      <CardContent>     
        <Typography gutterBottom variant="h5" component="div">
          {info.city} {info.humidity>80? <ThunderstormIcon/>: info.temp>20? <SunnyIcon/> : <AcUnitIcon/>}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }} component={"span"}>
            <p>Temperature: {info.temp}&deg;C</p>
            <p>Humidity: {info.humidity}&deg;C</p>
            <p>Min Temp: {info.tempMin}&deg;C</p>
            <p>Max Temp: {info.tempMax}&deg;C</p>
            <p>The weather can be described as <i>{info.weather}</i> and feels like {info.feelslike}&deg;C</p>
        </Typography>
      </CardContent>
    </Card>
    </div>
    )
    
}