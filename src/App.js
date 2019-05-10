import React from 'react';
import './App.css';
import {Spinner} from '@salesforce/design-system-react';
import {Tooltip} from '@salesforce/design-system-react';
import {IconSettings} from '@salesforce/design-system-react';


/*
This component is used to contain and render the other two components which will
display the data
 */
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
/*
This component displays a simple header with instructions on how to interact with the web page.
The tooltip was added to show the functionality tagged to the temp shown on screen.
 */
class WeatherHeader extends React.Component{
    render(){
        return(
            <div>
                <IconSettings iconPath="/assets/icons">
                    <Tooltip
                        id= "header tooltip"
                        content={"Click the temperature for a city and see what happens!"}
                        align="bottom"
                        dialogClassName="header__tooltip"
                        position={"relative"}
                        >
                        <header>
                            Please Click a City Below to See a Full Weather Report
                        </header>
                    </Tooltip>
                </IconSettings>
            </div>
        );
    }
}
/*
CityList is responsible for containing each of the city components, and fetching the data from the weather api.
 */
class CityList extends React.Component{
    /*
    componentDidMount is in charge of fetching the data and then updating the state of the cityList so that it renders
    again after the data is fetched. My original problem was that the page would render before the data was
    fetched which resulted in city components that had no information in them. In addition to this when the component
    is mounted the isLoading state is set to true so a spinner will be returned on screen letting the user know that
    the data is currently being loaded. Once the data is fetched the isLoading state is set to false and the current
    weather info for each city is displayed.
     */
    componentDidMount() {
        this.setState({
            isLoading: true
        });
        /*
        If changing number of ID's called make sure to create a corresponding number of city objects as well
         */
        fetch("http://api.openweathermap.org/data/2.5/group?id=5263045,5037649,4887398,4684888&APPID=07df4cb7dd53c7d702e04e5c3f659e13&units=imperial")
            .then(response => response.json())
            .then(data => this.setState({ city: data.list, isLoading: false }));
    }
    /*
    constructor to set initial state of cityList and also contain a state for the data being fetched as well.
     */
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
                <div style={{ position: 'relative', height: '5rem' }}>
                    <Spinner
                        variant="base"
                    />
                </div>
            )
        }
        /*
        Object to contain all the data used in the city component to be passed as props.
        Unfortunately this is not very dynamic and if the list of cities is changed, the number of objects created
        must also be updated. When the object is created it must also be given an index in order for the program
        to work. Since the API call would need to be modified to change the data being fetched I decided this was
        an acceptable drawback as either way the code would need to be modified.
        I tried using the forEach method to make creating the cities more dynamic but then I could not find a
        way to assign an index which is then used in the getInfo function
         */
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
        let City1 = Object.create(cityObject);
        City1.index = 0;
        let City2 = Object.create(cityObject);
        City2.index = 1;
        let City3 = Object.create(cityObject);
        City3.index = 2;
        let City4 = Object.create(cityObject);
        City4.index = 3;
        if(this.state.city.length > 0) {
            this.getInfo(City1);
            this.getInfo(City2);
            this.getInfo(City3);
            this.getInfo(City4);
        }

        return(
            <div>
                {this.renderCity(City1)}
                {this.renderCity(City2)}
                {this.renderCity(City3)}
                {this.renderCity(City4)}
            </div>
        )
    };
    /*
    This function is used to pull the data for each city and place it into the city object. Some additional
    formatting takes place to make the output easier to read as well.
     */
    getInfo(currentCity){
        currentCity.name = this.state.city[currentCity.index].name;
        currentCity.temperatureData = Math.round(this.state.city[currentCity.index].main.temp);
        currentCity.iconCode = fetchIcon(this.state.city[currentCity.index].weather[0].icon);
        currentCity.windSpeed ="Wind Speed is currently ";
        currentCity.windSpeed +=this.state.city[currentCity.index].wind.speed;
        currentCity.windSpeed += " MPH";
        currentCity.minTemp = "The low for today is ";
        currentCity.minTemp += Math.round(this.state.city[currentCity.index].main.temp_min);
        currentCity.maxTemp = "The high for today is ";
        currentCity.maxTemp += Math.round(this.state.city[currentCity.index].main.temp_max);
        currentCity.description = "Expect ";
        currentCity.description += this.state.city[currentCity.index].weather[0].description;
    }
    /*
    renderCity simply assigns the values from the city object as props to be used in the city component and then
    returns that city component.
     */
    renderCity(cityBeingRendered){
        return(
            <div>
                <City
                    name = {cityBeingRendered.name}
                    temp = {cityBeingRendered.temperatureData}
                    icon = {cityBeingRendered.iconCode}
                    windSpeed={cityBeingRendered.windSpeed}
                    minTemp={cityBeingRendered.minTemp}
                    maxTemp={cityBeingRendered.maxTemp}
                    description={cityBeingRendered.description}

                />
            </div>
        )
    }
}
/*
The fetchIcon function takes the iconCode from the API and adds the appropriate string before and after
in order for the icon image to be found. This could be done in line above in the getInfo function but
I decided to separate it keep the getInfo function clean and easy to understand.
 */
function fetchIcon(value){
    let iconURL;
    iconURL = "http://openweathermap.org/img/w/";
    iconURL += value;
    iconURL += ".png";
    return iconURL;
}
/*
The city component is where all the data is rendered and displayed to the screen. The information is passed in
as props and used to set the initial state for the temperature. The only information displayed originally is the
name, temperature, and icon for the city. Once clicked the city expands to reveal more information.
 */
class City extends React.Component{
    constructor(props){
        super(props);
        this.name = props.name;
        this.icon = props.icon;
        this.state = {
            celsius: false,
            units: "°F",
            temperature: props.temp,
            hideExtra: false,
        };
    }
    /*
    This renders the city with the click handler attached to the name to expand the city on click, as well as the
    click handler for the temperature to change units. The style hideExtra is used so that the additional information
    is only shown when the hideExtra trait is set to true.
     */
    render(){
        const hideExtra = this.state.hideExtra ? {} : {display: 'none'};
        return(
            <div className={"city"} >
                <h1
                    onClick={()=> this.expandCity()}
                    title={"Click for More Info"}>
                        {this.name} </h1>
                <p onClick={()=>this.changeUnits()}
                   title={"Click to Change Units"}
                   className={"city__temp"}>
                        {this.state.temperature}{this.state.units} </p>

                <img src={this.icon} alt={"icon"}/>
                <p className={"city__info"} style={hideExtra}> {this.props.windSpeed}</p>
                <p className={"city__info"} style={hideExtra}> {this.props.minTemp}{this.state.units}</p>
                <p className={"city__info"} style={hideExtra}> {this.props.maxTemp}{this.state.units}</p>
                <p className={"city__info"} style={hideExtra}> {this.props.description}</p>
            </div>
        );
    }
    /*
    A simple function used to flip the hideExtra state from true to false and vice versa when clicked
     */
    expandCity() {
        this.setState({
            hideExtra: !this.state.hideExtra,
        })

    }
    /*
    The changeUnits function is used to alternate the temperature being displayed in Fahrenheit or in Celsius. This uses
    the Celsius state to determine which type of units to return and then changes the state accordingly.
     */
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