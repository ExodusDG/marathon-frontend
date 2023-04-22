import '../App.css';
import loading from '../image/loading.svg'

function Loading() {

    return (
        <div className="loadingWrapper">
            <div className="loadingBlock">
                <img src={loading} alt="Loading" />
                <p>Loading...</p>
            </div>
        </div>
    );
}

export default Loading;