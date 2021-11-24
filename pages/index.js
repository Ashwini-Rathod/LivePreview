import Head from "next/head";
import {useEffect, useState} from 'react'
let url = `https://cdn.contentstack.io/v3/content_types/live_preview/entries/blte2be7187b7e7ee36?environment=${process.env.ENVIRONMENT_NAME}&include_fallback=true`

function Home(props) {
  useEffect(() => {
    console.log("ref", ref.current, window)
    
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
  window.addEventListener("message",(e) => {
    // console.log("TEST", e)
    // console.log("DATA", e.data.data)
    if(e.data.data.hasOwnProperty('hash')){
      console.log("HERERERERER")
    }
    // await fetch(`${url}&live_preview=${e.data.data['hash']}&content_type_uid=${e.data.data['content_type_uid']}`)
    // .then((res) => {
    //   return res.json()
    // })
    // .then((data) => {
    //   console.log("DATA",data)
    // })
    // .catch((err) => {
    //   console.log("err", err)
    // })
  });
  // window.addEventListener('message', handlePostMessage)

  // if(ref.current) {
  //   console.log("If")
  //   ref.current.addEventListener('message', handlePostMessage)
  //   // ref.current.addEventListener('click', (e) => {
  //   //   console.log("click event ", e)
  //   // })
  // }
  }, [])
  return (
    <div ref ={ref}>
      <Head>
        <title>{props.entry.entry['title']}</title>
      </Head>
      <div >
        <div>
          <h1>{props.entry.entry['single_line']}</h1>
          <p>
            {props.entry.entry['multi_line']}
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


