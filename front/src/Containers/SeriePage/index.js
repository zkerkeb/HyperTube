import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import allTheActions from '../../Actions';
import SeriePage from '../../Components/SeriePage';

const Serie = ({ serie, translation, actions, id }) =>
  <div>
    <SeriePage serie={serie} id={id} translation={translation} actions={actions} />
  </div>

const mapStateToProps = (state, ownProps) => ({
  translation: state.translation,
  id: ownProps.params.id,
  serie: state.serie,
});

const mapDispatchToProps = dispatch => ({
  actions: {
    serie: bindActionCreators(allTheActions.serie, dispatch),
    translation: bindActionCreators(allTheActions.translation, dispatch),
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Serie);
