import * as actions from './actions';
import reducer from './reducer';
import * as selectors from './selectors';

export {default as DoFacetedSearch} from './components/DoFacetedSearch';
export {default as FacetedSearchResultList} from './components/FacetedSearchResultList';
// export {default as DocDetails} from './components/DocDetails';

export default {actions, reducer, selectors};