import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Segment, Button, Label, Popup } from 'semantic-ui-react';

//Actions
import { fetchHerePlaces, clear, loadTracks, getAccessToken } from '../actions/actions';


const segmentStyle = {
    zIndex: 999,
    position: 'absolute',
    width: '400px',
    top: '10px',
    left: '10px',
    maxHeight: 'calc(100vh - 3vw)',
    overflow: 'auto',
    padding: '20px'
  }

  // some HERE Maps places categories we want to be able to fetch with some cute colors
const herePlaces = {
    0: { name: 'shopping', color: 'red' },
    1: { name: 'accommodation', color: 'orange' },
    2: { name: 'administrative-areas-buildings', color: 'yellow' },
    3: { name: 'airport', color: 'olive' },
    4: { name: 'atm-bank-exchange', color: 'green' },
    5: { name: 'coffee-tea', color: 'teal' },
    6: { name: 'eat-drink', color: 'blue' },
    7: { name: 'going-out', color: 'violet' },
    8: { name: 'hospital-health-care-facility', color: 'purple' },
    9: { name: 'leisure-outdoor', color: 'pink' },
    10: { name: 'natural-geographical', color: 'brown' },
    11: { name: 'petrol-station', color: 'green' },
    12: { name: 'restaurant', color: 'grey' },
    13: { name: 'snacks-fast-food', color: 'black' },
    14: { name: 'sights-museums', color: 'red' },
    16: { name: 'toilet-rest-area', color: 'yellow' },
    17: { name: 'transport', color: 'olive' }
  }
  
  // we will use some functional react components to make our lives simple
  const CustomLabel = ({ content, value }) => (
    <Popup content={content} trigger={<Label size="tiny">{value}</Label>} />
  )
  
  class Control extends React.Component {
    static propTypes = {
      places: PropTypes.object,
      dispatch: PropTypes.func.isRequired
    }
  
    // what happens if we click a places button
    handleClick = (event, data) => {
      const { dispatch } = this.props
      dispatch(fetchHerePlaces({ category: data.content, color: data.color }))
    }

    handleLoadTracksClick = () => {
      const { dispatch, accessToken } = this.props;
      dispatch(getAccessToken({token: accessToken}));
    }
  
    // and also what happens if we click the remove icon
    handleClickClear = () => {
      const { dispatch } = this.props
      dispatch(clear())
    }
  
    // some buttons can be disabled if no places exist..
    areButtonsDisabled = places => {
      let buttonsDisabled = true
      for (const key in places) {
        if (places.hasOwnProperty(key)) {
          if (places[key].hasOwnProperty('data') && places[key].data.length > 0) {
            buttonsDisabled = false
          }
        }
      }
      return buttonsDisabled
    }

    render() {
        // places coming directly from our redux state
        const { places } = this.props
    
        // another functional class component with a magnitude of props options
        // this component will be used multiple times in this application
        const CustomButton = ({
          content,
          circular,
          popupContent,
          handler,
          icon,
          value,
          disabled,
          basic,
          size,
          loading,
          color
        }) => (
          <Popup
            content={popupContent}
            size={size}
            trigger={
              <Button
                color={color}
                circular={circular}
                content={content}
                loading={loading}
                size={size}
                onClick={handler}
                basic={basic}
                disabled={disabled}
                icon={icon}
              />
            }
          />
        )
    
        // we will loop through the herePlaces object defined above and add semantic ui buttons this way
        return (
          <div>
            <Segment style={segmentStyle}>
              <div>
                {Object.keys(herePlaces).map((key, index) => {
                  return (
                    <div key={index} className="mt1 dib">
                      <CustomButton
                        icon={false}
                        popupContent={'Fetch places of this category'}
                        content={herePlaces[key].name}
                        disabled={false}
                        handler={this.handleClick}
                        color={herePlaces[key].color}
                        loading={
                          places[herePlaces[key].name]
                            ? places[herePlaces[key].name].isFetching
                            : false
                        }
                        size="tiny"
                      />
                    </div>
                  )
                })}
                <div className="mt2">
                  <CustomButton
                    icon={'remove'}
                    size={'tiny'}
                    popupContent={'Reset places and map'}
                    handler={this.handleClickClear}
                    disabled={this.areButtonsDisabled(places)}
                  />
                </div>
                <div className="mt2">
                  <CustomButton
                    icon={'remove'}
                    size={'tiny'}
                    color={'blue'}
                    popupContent={'Load Tracks'}
                    handler={this.handleLoadTracksClick}
                    disabled={false}
                  />
                </div>
              </div>
            </Segment>
          </div>
        )
      }
    }
    
    // connecting this class component to our react store!
    const mapStateToProps = state => {
      const { places } = state.placesControls
      return {
        places
      }
    }
    
    export default connect(mapStateToProps)(Control)