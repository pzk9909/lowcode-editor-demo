import './style.css';
import Left from '../Left/Left';
import Right from '../Right/Right';
import Middle from '../Middle/Middle';
export default function Home() {
    return (
        <div className='home-page-container'>
            <Left></Left>
            <Middle></Middle>
            <Right></Right>
        </div>
    );
}
