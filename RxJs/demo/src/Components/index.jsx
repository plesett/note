import React, { Component } from 'react';

import { Link } from 'react-router-dom';

export default class List extends Component {
    render() {
        return (
            <div>
                <Link to='/combineAll'>/combineAll</Link>
                <Link to='/combineLatest'>/combineLatest</Link>
                <Link to='/concat'>/concat</Link>
                <Link to='/forkJoin'>/forkJoin</Link>
                <Link to='/merge'>/merge</Link>
                <Link to='/pairwise'>/pairwise</Link>
                <Link to='/Race'>/Race</Link>
                <Link to='/startWith'>/startWith</Link>
                <Link to='/withLatestFrom'>/withLatestFrom</Link>
            </div>
        )
    }
}
