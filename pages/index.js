import Head from "next/head";
import {useEffect, useState} from 'react'
let url = `https://cdn.contentstack.io/v3/content_types/live_preview/entries/blte2be7187b7e7ee36?environment=${process.env.ENVIRONMENT_NAME}&include_fallback=true`
let apiUrl = `https://api.contentstack.io/v3/content_types/live_preview/entries/blte2be7187b7e7ee36?`

function Home(props) {
  //defining states for all the fields available in a CT
  const [title, setTitle] = useState(props.entry.entry['title'])
  const [singleLine, setSingleLine] = useState(props.entry.entry['single_line'])
  const [multi_line, setMultiLine] = useState(props.entry.entry['multi_line'])
  const [para1, setPara1] = useState(props.entry.entry['paragraph_1'])
  const [para2, setPara2] = useState(props.entry.entry['paragraph_2'])
  const [para3, setPara3] = useState(props.entry.entry['paragraph_3'])

  useEffect(() => {
    //initializing live preview when the page renders for the first time.
    window.parent.postMessage(
      {
          from: "live-preview",
          type: "init",
          data: {
              config: {
                  shouldReload: false,
                  href: window.location.href,
              },
          },
      },
      "*"
  );
  //listening to post messages for the hash value
  window.addEventListener("message", async (e) => {
    const {data} = e.data
    if(data.hasOwnProperty('hash')){
      //making an api call with the hash generated and content type uid
      let res = await fetch(`${apiUrl}live_preview=${data['hash']}&content_type_uid=${data['content_type_uid']}`, {
        headers: {
          api_key: process.env.API_KEY,
          access_token: process.env.DELIVERY_TOKEN
        }
      })
      let entryData = await res.json()
      //changing the states based on the data changed for that particular hash and rendering the same
      if(entryData){
      setTitle(entryData.entry['title'])
      setSingleLine(entryData.entry['single_line'])
      setMultiLine(entryData.entry['multi_line'])
      setPara1(entryData.entry['paragraph_1'])
      setPara2(entryData.entry['paragraph_2'])
      setPara3(entryData.entry['paragraph_3'])
      }
    }
   
  });
  }, [])
  return (
    <div style={{width: "90%", margin: "auto"}}>
      <Head>
        <title>{title}</title>
      </Head>
      <div >
        <h1  style={{textAlign: 'center'}}>{singleLine}</h1>
        <div style={{margin: "auto", textAlign: 'center'}}>
          <img src={props.entry.entry.file['url']} alt="wildlife" style={{width: '60%', height:"60%", marginBottom: "30px"}}/>
        </div>
        <p style={{width: "70%", margin: 'auto'}}>
          {multi_line}
        </p>
        <div style={{margin: 'auto', paddingTop: "15px", width: "70%"}}>
          <ul >
            <li style={{marginTop: '10px', marginBottom: '10px'}}>{para1}</li>
            <li style={{marginTop: '10px', marginBottom: '10px'}}>{para2}</li>
            <li style={{marginTop: '10px', marginBottom: '10px'}}>{para3}</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps = async (context) => {
  //make an api call to a particular entry with required headers
  const res = await fetch(url, {
    headers: {
      api_key: process.env.API_KEY,
      access_token: process.env.DELIVERY_TOKEN
    }
  })
  const data = await res.json()
  if (!data) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      entry: {...data} ,
    }
  };
};

export default Home;


