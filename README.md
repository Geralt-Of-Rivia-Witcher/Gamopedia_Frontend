<p align="center">
  <h1 align="center">Gamopedia Frontend</h1>

  <p align="center">
    <h3 align="center">The Frontend code of Gamopedia web app</h3>
    <p align="center" >
      <a href="https://gamopedia.herokuapp.com/">Live Demo</a>
    </p>
    <br />
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project
<p  align="center">
  <img align="center" src="https://github.com/Geralt-Of-Rivia-Witcher/Gamopedia_Frontend/blob/master/images/screenshot.PNG">
  <br />
  <br />

  <img align="center" src="https://github.com/Geralt-Of-Rivia-Witcher/Gamopedia_Frontend/blob/master/images/screenshot2.PNG">
</p>
<br />
<br />

This is the frontend code for the Gamopedia Web app. It's like an encyclopedia for video games where you can get detailed information about any video game you want. Information includes Developer, Publisher, release date, Stores, Screenshots, etc.
<br />
<br />
The information is fetched from <a href="https://rawg.io/apidocs">RAWG Video Game Database</a> through an API request.

### Built With
[<img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">](https://reactjs.org/)
<br />


<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

* npm

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/Geralt-Of-Rivia-Witcher/Gamopedia_Frontend
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. If you have your backend deployed on a cloud service like "Heroku", then create a `.env` file and paste your backend URL in it.
   ```JS
   BACKEND_URL = 'YOUR BACKEND URL'
   ```
   otherwise, React will make a post request at "http://localhost:5000/"

4. Start the development server.
   ```JS
   npm start
   ```
   Open "http://localhost:3000" to view it in the browser. The page will reload if you make edits. You will also see any lint errors in the console.



<!-- USAGE EXAMPLES -->
## Usage

This Frontend code will send a `post` request to the backend to get the game info.



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b branch_name`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin branch_name`)
5. Open a Pull Request



<!-- CONTACT -->
## Contact

[<img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white">](https://www.linkedin.com/in/siddhant-kumar-singh-/) [<img src="https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white"></img>](mailto:singhsiddhantkumar@gmail.com)
