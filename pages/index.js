import Head from "next/head";
import {useEffect, useState} from 'react'
let url = `https://cdn.contentstack.io/v3/content_types/live_preview/entries/blte2be7187b7e7ee36?environment=${process.env.ENVIRONMENT_NAME}&include_fallback=true`
let testURL = `https://api.contentstack.io/v3/content_types/live_preview/entries/blte2be7187b7e7ee36?`

function Home(props) {
  const [title, setTitle] = useState(props.entry.entry['title'])
  const [singleLine, setSingleLine] = useState(props.entry.entry['single_line'])
  const [multi_line, setMultiLine] = useState(props.entry.entry['multi_line'])
  useEffect(() => {
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
  window.addEventListener("message", async (e) => {
    const {data} = e.data
    if(data.hasOwnProperty('hash')){
      let res = await fetch(`${testURL}live_preview=${data['hash']}&content_type_uid=${data['content_type_uid']}`, {
        headers: {
          api_key: process.env.API_KEY,
          access_token: process.env.DELIVERY_TOKEN
        }
      })
      let entryData = await res.json()
      if(entryData){
        setTitle(entryData.entry['title'])
      setSingleLine(entryData.entry['single_line'])
      setMultiLine(entryData.entry['multi_line'])
      }
      // console.log(entryData)
    }
   
  });
  }, [])
  return (
    <div>
      <Head>
        <title>{title}</title>
      </Head>
      <div >
        <div>
          <h1>{singleLine}</h1>
          <p>
            {multi_line}
          </p>
        </div>
      </div>
    </div>
  );
}

export const getStaticProps = async (context) => {
  const res = await fetch(url, {
    headers: {
      api_key: process.env.API_KEY,
      access_token: process.env.DELIVERY_TOKEN
    }
  })
  const data = await res.json()
  console.log("data",data)
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


