import { Oval } from 'react-loader-spinner'

const Loading = () => {
  
  return (
    <Oval
        height={50}
        width={50}
        color="#E6334C"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        ariaLabel='oval-loading'
        secondaryColor="#E6334C"
        strokeWidth={2}
        strokeWidthSecondary={2}
    />
  )
}

export default Loading