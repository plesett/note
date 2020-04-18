import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import List from '../Components/';
import CombineAll from '../Components/combineAll';
import CombineLatest from '../Components/combineLatest';
import Concat from '../Components/Concat/';
import ForkJoin from '../Components/forkJoin/';
import Merge from '../Components/Merge/';
import Pairwise from '../Components/pairwise/';
import Race from '../Components/race/';
import startWith from '../Components/startWith/';
import withLatestFrom1 from '../Components/withLatestFrom/';

export default class RouterIndex extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route exact path='/' component={List} />
                    <Route exact path='/combineAll' component={CombineAll} />
                    <Route exact path='/combineLatest' component={CombineLatest} />
                    <Route exact path='/concat' component={Concat} />
                    <Route exact path='/forkJoin' component={ForkJoin} />
                    <Route exact path='/merge' component={Merge} />
                    <Route exact path='/pairwise' component={Pairwise} />
                    <Route exact path='/Race' component={Race} />
                    <Route exact path='/startWith' component={startWith} />
                    <Route exact path='/withLatestFrom' component={withLatestFrom1} />
                </Switch>
            </BrowserRouter>
        )
    }
}
