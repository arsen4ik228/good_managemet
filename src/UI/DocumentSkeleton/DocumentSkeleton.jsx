import { Skeleton } from 'antd';
import classes from './Style.module.css';

export const DocumentSkeleton = () => {
  // Стили для скелетона, имитирующие текст
  const skeletonTitleStyle = {
    marginBottom: '10px'
  };

  const skeletonTextStyle = {
    marginBottom: '5px'
  };

  return (
    <div className={classes.main}>
      {/* Шапка документа */}
      <div style={{ marginBottom: '20px' }}>
        <div className={`${classes.strong} ${classes.margin}`}>
          <Skeleton 
            active 
            title={false} 
            paragraph={{ rows: 1, width: 200 }}
            style={skeletonTitleStyle}
          />
        </div>
        
        <div className={classes.strong}>
          <Skeleton 
            active 
            title={false} 
            paragraph={{ rows: 1, width: 150 }}
            style={skeletonTextStyle}
          />
        </div>
        
        <div className={classes.margin}>
          <Skeleton 
            active 
            title={false} 
            paragraph={{ rows: 1, width: 180 }}
            style={{ marginTop: 10 }}
          />
        </div>
      </div>

      {/* Центрированные заголовки */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div className={`${classes.strong} ${classes.center} ${classes.margin}`}>
          <Skeleton 
            active 
            title={false} 
            paragraph={{ rows: 1, width: 120 }}
            style={{ display: 'inline-block' }}
          />
        </div>
        <div className={`${classes.strong} ${classes.center}`}>
          <Skeleton 
            active 
            title={false} 
            paragraph={{ rows: 1, width: 250 }}
            style={{ display: 'inline-block' }}
          />
        </div>
      </div>

      {/* Блок информации */}
      <div style={{ marginBottom: '40px' }}>
        <Skeleton 
          active 
          title={{ width: 100 }}
          paragraph={{ rows: 4 }}
        />
      </div>

      {/* Блоки задач */}
      <div className={classes.container}>
        {/* Генерируем 2 контейнера задач */}
        {[1, 2].map((containerIndex) => (
          <div key={containerIndex}>
            {/* Заголовок контейнера */}
            <Skeleton 
              active 
              title={false} 
              paragraph={{ rows: 1, width: 150 }}
              style={{ marginBottom: 15 }}
            />
            
            {/* Задачи в контейнере */}
            {[1, 2, 3].map((taskIndex) => (
              <div key={taskIndex} className={classes.wrapperBorder}>
                <div className={classes.leftBlock}>
                  <Skeleton.Avatar active size="small" shape="circle" />
                  <Skeleton.Input active style={{ width: 200 }} size="small" />
                </div>
                <div className={classes.rightBlock}>
                  <Skeleton.Input active style={{ width: 100 }} size="small" />
                  <Skeleton.Input active style={{ width: 60 }} size="small" />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};