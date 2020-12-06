import { render, screen } from '@testing-library/react';
import App from './App';
import { getLocation } from './components/Landing.js';
import { Landing } from './components/Landing.js';
import { reportWebVitals } from './reportWebVitals.js';

test('renders welcome page', () => {
  render(<App />);
  const linkElement = screen.getByText(/Welcome/i);
  expect(linkElement).toBeInTheDocument();
});

test('tests get location function', () => {
  let x = getLocation([{email: 'ctc2141@columbia.edu', location:[50,50]}], 'ctc2141@columbia.edu');
  expect(x).toStrictEqual([50,50]);
});

/*
test('landing page', () => {
  let myprops = {_json: {email: 'ctc2141@columbia.edu', email_verified: true, family_name: 'Coyne',
given_name: 'Christopher Thomas', hd: 'Columbia.edu', locale: 'en', name: 'Christopher Thomas Coyne',
picture: 'https://lh3.googleusercontent.com/-Hh16cEP0I3w/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuckwWUW_zBbkhktwk-GogUdM70zpxg/s96-c/photo.jpg',
sub: '104777281757844520109'}, displayName: 'Christopher Thomas Coyne', 
emails:{value: 'ctc2141@columbia.edu', verified: true}, id: "104777281757844520109",
name: {familyName: 'Coyne', givenName: 'Christopher Thomas'}, 
photos: [{value: 'https://lh3.googleusercontent.com/-Hh16cEP0I3w/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuckwWUW_zBbkhktwk-GogUdM70zpxg/s96-c/photo.jpg'}],
provider: 'google'};

  const landing_func = myprops => {
     Landing(myprops);


  Landing(myprops);
});


test('webvitals test', () => {
  let x = reportWebVitals;
  console.log('type of rwv: ', typeof x);
  x(console.log);
})
*/
