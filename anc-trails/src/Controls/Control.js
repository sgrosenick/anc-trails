import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import '../index.scss';

//Actions
import { clear, getAccessToken, toggle2020Tracks } from '../actions/actions';
  
  
class Control extends React.Component {
    static propTypes = {
      places: PropTypes.object,
      dispatch: PropTypes.func.isRequired
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

    handleToggle2020Tracks = () => {
      const { dispatch, remove2020Tracks } = this.props;
      dispatch(toggle2020Tracks({remove2020Tracks}));
    }

    render() {
        return (
          <div className="control-area">
            <h2>Legend</h2>
            <Button 
              variant="contained"
              color="primary"
              onClick={this.handleToggle2020Tracks}>
              Toggle Tracks
            </Button>
          </div>
        )
      }
}
    
    // connecting this class component to our react store!
    const mapStateToProps = state => {
      const { places, remove2020Tracks } = state.placesControls
      return {
        places,
        remove2020Tracks
      }
    }
    
    export default connect(mapStateToProps)(Control)