import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import '../index.scss';

//Actions
import { clear, getAccessToken, toggle2020Tracks, toggle2019Tracks } from '../actions/actions';
  
  
class Control extends React.Component {
    static propTypes = {
      places: PropTypes.object,
      dispatch: PropTypes.func.isRequired,
      remove2020Tracks: PropTypes.bool
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
      const { dispatch, show2020Tracks } = this.props;
      dispatch(toggle2020Tracks({show2020Tracks}));
    }

    handleToggle2019Tracks = () => {
      const { dispatch, show2019Tracks } = this.props;
      dispatch(toggle2019Tracks({show2019Tracks}));
    }

    render() {
        
        return (
          <div className="control-area">
            <h2>Legend</h2>
            <FormGroup>
              <FormControlLabel
                control={<Switch checked={this.props.show2020Tracks} onChange={this.handleToggle2020Tracks} />}
                label="2020 Tracks">
              </FormControlLabel>
            </FormGroup>
            <FormGroup>
              <FormControlLabel
                control={<Switch checked={this.props.show2019Tracks} onChange={this.handleToggle2019Tracks} />}
                label="2019 Tracks">
              </FormControlLabel>
            </FormGroup>
          </div>
        )
      }
}
    
    // connecting this class component to our react store!
    const mapStateToProps = state => {
      const { places, show2020Tracks, show2019Tracks } = state.tracksReducer
      return {
        places,
        show2020Tracks,
        show2019Tracks
      }
    }
    
    export default connect(mapStateToProps)(Control)