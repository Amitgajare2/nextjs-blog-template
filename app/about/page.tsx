import Navigation from '@/components/Navigation'
import AuthorBio from '@/components/AuthorBio'
import React from 'react'

const page = () => {
  return (
    <>
    <Navigation />
    <main className="main">
      <div className="container">
        <h1 className="title">About</h1>
        
        <div className="about-content">
          <div className="about-intro">
            <p>
              Welcome to Unfiltered Mind - the digital echo of frustration, logic, and rebellion.
            </p>
            <p>
              This is where i write what TRP-hungry media won't, and what politicians fear the most - truth served without filter.
            </p>
            <p>
              No party lines, no propaganda, just reality, sarcasm, and a voice that refuses to be silenced.
            </p>
            <p>
              Because democracy isn't about silence - it's about saying what they don't want to hear.
            </p>
          </div>
          
          <AuthorBio 
            variant="full" 
            showSocial={true} 
            showCredentials={true} 
            showExpertise={true}
            className="about-author-bio"
          />
        </div>
      </div>
    </main>
    </>
  )
}

export default page
