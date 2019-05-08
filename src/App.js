import React from 'react';
import './App.css';

class WeatherWebsite extends React.Component{
    render(){
        return(
            <div>
                <WeatherHeader />
                <CityList />
            </div>

        );
    }
}
class WeatherHeader extends React.Component{
    render(){
        return(
            <div>
                <header>
                    Please Click a City Below to See a Full Weather Report
                </header>
                <p className={"small_header"}> Try clicking the temperature for a city </p>
            </div>
        );
    }
}
class CityList extends React.Component{
    componentDidMount() {
        this.setState({
            isLoading: true
        });
        fetch("http://api.openweathermap.org/data/2.5/group?id=5263045,5037649,4887398,4684888&APPID=07df4cb7dd53c7d702e04e5c3f659e13&units=imperial")
            .then(response => response.json())
            .then(data => this.setState({ city: data.list, isLoading: false }));
    }

    constructor(props){
        super(props);
        this.state = {
            isLoading: false,
            city: []
        }

    }
    render(){
        if(this.state.isLoading){
            return(
                <h1>Loading...</h1>
            )
        }
        let cityObject = {
            name: " ",
            temperatureData: 0,
            iconCode: " ",
            windSpeed: 0,
            minTemp: 0,
            maxTemp: 0,
            description: " ",
            index: 0,
        };
        let Milwaukee = Object.create(cityObject);
        Milwaukee.index = 0;
        let Minneapolis = Object.create(cityObject);
        Minneapolis.index = 1;
        let Chicago = Object.create(cityObject);
        Chicago.index = 2;
        let Dallas = Object.create(cityObject);
        Dallas.index = 3;
        if(this.state.city.length > 0) {
            this.getInfo(Milwaukee);
            this.getInfo(Minneapolis);
            this.getInfo(Chicago);
            this.getInfo(Dallas);
        }

        return(
            <div>
                {this.renderCity(Milwaukee)}
                {this.renderCity(Minneapolis)}
                {this.renderCity(Chicago)}
                {this.renderCity(Dallas)}
            </div>
        )
    };//end of render
    getInfo(city){
        city.name = this.state.city[city.index].name;
        city.temperatureData = Math.round(this.state.city[city.index].main.temp);
        city.iconCode = fetchIcon(this.state.city[city.index].weather[0].icon);
        city.windSpeed ="Wind Speed is currently ";
        city.windSpeed +=this.state.city[city.index].wind.speed;
        city.windSpeed += " MPH";
        city.minTemp = "The low for today is ";
        city.minTemp += Math.round(this.state.city[city.index].main.temp_min);
        city.maxTemp = "The high for today is ";
        city.maxTemp += Math.round(this.state.city[city.index].main.temp_max);
        city.description = "Expect ";
        city.description += this.state.city[city.index].weather[0].description;
    }
    renderCity(city){
        return(
            <div>
                <City
                    name = {city.name}
                    temp = {city.temperatureData}
                    icon = {city.iconCode}
                    windSpeed={city.windSpeed}
                    minTemp={city.minTemp}
                    maxTemp={city.maxTemp}
                    description={city.description}

                />
            </div>
        )
    }
}
function fetchIcon(value){
    let iconURL;
    iconURL = "http://openweathermap.org/img/w/";
    iconURL += value;
    iconURL += ".png";
    return iconURL;
}
class City extends React.Component{
    constructor(props){
        super(props);
        this.name = props.name;
        this.icon = props.icon;
        this.state = {
            celsius: false,
            units: "°F",
            temperature: props.temp,
            expanded: true,
            windSpeed: null,
        };
    }
    render(){
        const hideExtra = this.state.expanded ? {display: 'none'} : {};
        return(
            <div className={"city"} >
                <h1
                    onClick={()=> this.expandCity()}
                    title={"Click for More Info"}>
                        {this.name} </h1>
                <p onClick={()=>this.changeUnits()}
                   title={"Click to Change Units"}
                   className={"temp"}>
                        {this.state.temperature}{this.state.units} </p>

                <img src={this.icon} alt={"icon"}/>
                <p style={hideExtra}> {this.props.windSpeed} </p>
                <p style={hideExtra}> {this.props.minTemp}{this.state.units}</p>
                <p style={hideExtra}> {this.props.maxTemp}{this.state.units}</p>
                <p style={hideExtra}> {this.props.description}</p>
            </div>
        );
    }
    expandCity(){
        if(!this.state.expanded) {
            this.setState({
                extra:true,
                expanded: !this.state.expanded,
            });
            return (
                <div>
                    <p>{this.props.windSpeed} MPH</p>
                </div>
            )
        }
        else{
            this.setState({
                extra: null,
                expanded: !this.state.expanded,
            })
        }
    }
    changeUnits(){
        let newTemperature = 0;
        let newUnits = " ";
        if(this.state.celsius){
            newTemperature = ((this.state.temperature * 9/5)+ 32).toFixed(0);
            newUnits = " °F";
        }
        else{
            newTemperature = ((this.state.temperature - 32) * 5/9).toFixed(1);
            newUnits = " °C";
        }
        this.setState({
            temperature: newTemperature,
            celsius: !this.state.celsius,
            units: newUnits,
        })
    }
}
export default WeatherWebsite;