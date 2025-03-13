import classes from './style.module.css'

export const FullScreenImageModal = ({ imageUrl, onClose }) => {
    console.log("imageUrl");
    console.log(imageUrl);
    console.log("onClose");
    console.log(onClose);
    if (!imageUrl) return null;

    return (
        <div className={classes.fullScreenModalOverlay} onClick={onClose}>
            <div className={classes.fullScreenModalContent}>
                <img src={imageUrl} alt="Full screen" className={classes.fullScreenImage} />
            </div>
        </div>
    );
};