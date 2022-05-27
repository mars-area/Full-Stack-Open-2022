const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  const Header = (props) => {
    return (
      <h1>{props.course.name}</h1>
    )
  }

  const Content = (props) => {
    return (
      <>
        {props.course.parts.map(content => {
          return (
            <p>
              {content.name} {content.exercises}
            </p>
          )
        })}
      </>
    )
  }

  const Total = (props) => {
    const total = props.course.parts.reduce((acc, content) => {
      return acc + content.exercises
    }, 0);
    return (
      <p>
        Number of exercises {total}
      </p>
    )
  }

  return (
    <div>
      <Header course={course} />
      <Content course={course} />
      <Total course={course} />
    </div>
  )
}

export default App