import React from 'react';
import ReactDOM from 'react-dom';

const baseURL = process.env.ENDPOINT;
let latitude = '';
let longitude = '';

const getWeatherFromApi = async () => {
  try {
    const fetchURL = latitude && longitude ? `${baseURL}/weather/${latitude}/${longitude}` : `${baseURL}/weather`;
    const response = await fetch(fetchURL);
    return response.json();
  } catch (error) {
    console.error(error);
  }
  return {};
};

class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      icon: '',
      description: '',
    };
  }

  // when page is loaded fetch the default weather
  async componentDidMount() {
    await this.getAndShowWeather();
  }

  // function to using the users location to get weather
  myLocation = async () => {
    if ('geolocation' in navigator) {
      // Geolocation is working so let's ask for user's current pos
      navigator.geolocation.getCurrentPosition((position) => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
        this.setState({ message: `We found your location as lat: ${latitude} lon: ${longitude}` });
      }, () => {
        // No access to location so let's return the values to default
        this.setState({ message: 'No location! Using default Helsinki instead' });
        latitude = '';
        longitude = '';
      }, { timeout: 30000, enableHighAccuracy: true, maximumAge: 75000 });
    } else {
      // locations are not available
      this.setState({ message: 'No location available!' });
    }
    await this.getAndShowWeather();
  };

  // Make a api call and set results to page
  getAndShowWeather = async () => {
    const weather = await getWeatherFromApi();
    this.setState({ icon: weather.icon.slice(0, -1), description: weather.description });
  };

  // render the page
  render() {
    const { icon, description, message } = this.state;
    return (
      <fragment>
        <div className="icon">
          { icon && <img src={`/img/${icon}.svg`} alt={`${description}`} /> }
        </div>
        <button className="red" type="button" onClick={this.myLocation}>Use my location!</button>
        <p>{ message }</p>
      </fragment>
    );
  }
}

ReactDOM.render(
  <Weather />,
  document.getElementById('app'),
);
