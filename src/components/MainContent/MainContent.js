import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import SectionOne from '../pages/SectionOne';
import SectionTwo from '../pages/SectionTwo';
import SectionThree from '../pages/SectionThree';
import SectionFour from '../pages/SectionFour';
import SectionFive from '../pages/SectionFive';
import './MainContent.scss';

function MainContent() {
  return (
    <main className="main-content">
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/section-one" />} />
        <Route exact path="/section-one" component={SectionOne} />
        <Route exact path="/section-two" component={SectionTwo} />
        <Route exact path="/section-three" component={SectionThree} />
        <Route exact path="/section-four" component={SectionFour} />
        <Route exact path="/section-five" component={SectionFive} />
        <Redirect to="/section-one" />
      </Switch>
    </main>
  );
}

export default MainContent;
