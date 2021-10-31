import React from "react";
import Masonry from "react-masonry-css";
import "./App.css";
import UnsplashLogo from "./images/Unsplash_Symbol.png"
require('dotenv').config({ path: './../.env' })


class Unsplash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [
        {
          label: "House in Valley",
          url: "https://images.unsplash.com/photo-1635598785659-60ddfb58696b?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80",
        },
        {
          label: "Shoulder",
          url: "https://images.unsplash.com/photo-1635359332867-d07e06a5b1bd?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=888&q=80",
        },
        {
          label: "Woodland",
          url: "https://images.unsplash.com/photo-1635614989896-afa3547d8c27?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80",
        },
        {
          label: "Electricity",
          url: "https://images.unsplash.com/photo-1635616045836-f0b92316e44f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80",
        },
        {
          label: "Desert Valley",
          url: "https://images.unsplash.com/photo-1635608724155-640bd8ccd2f2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80",
        },
        {
          label: "Deathly Romantic",
          url: "https://images.unsplash.com/photo-1635586668235-6e1457115785?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=685&q=80",
        },
        {
          label: "The Flow of Life",
          url: "https://images.unsplash.com/photo-1635598786348-9f9cbcaa66dc?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80",
        },
      ],
      modal: {
        active: false,
        state: "",
      },
      search: "",
      delete: 0,
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleChildClick = this.handleChildClick.bind(this);
    this.addPhoto = this.addPhoto.bind(this);
    this.deleteModal = this.deleteModal.bind(this);
    this.search = this.search.bind(this);
    this.deleteImg = this.deleteImg.bind(this);
  }

  async addPhoto(e) {
    e.preventDefault();
    await this.setState(() => ({
      images: [
        { label: e.target[0].value, url: e.target[1].value },
        ...this.state.images,
      ],
      modalActive: false,
    }));
    e.target[0].value = "";
    e.target[1].value = "";
    this.closeModal()
  }

  deleteModal(e) {
    this.setState(() => ({
      modal: {
        active: true,
        state: "delete",
      },
      delete: e.target.attributes.imagenr.value,
    }));
  }

  deleteImg(e) {
    e.preventDefault();
    console.log(process.env)
    if(e.target[0].value === process.env.REACT_APP_DELETE_PASSWORD) {
    let imageNr = +e.target[1].value + 1;
    let firstPart = this.state.images.slice(0, imageNr - 1);
    let lastPart = this.state.images.slice(imageNr, this.state.images.length);
    this.setState(() => ({
      images: [...firstPart, ...lastPart],
    }));
  } else {
    console.log('Password wrong')
  }
  }

  search(e) {
    this.setState(() => ({
      search: e.target.value,
    }));
  }

  openModal(e) {
    this.setState(() => ({
      modal: {
        active: true,
        state: e.target.attributes.modalbtn.value,
      },
    }));
  }

  closeModal(e) {
    this.setState(() => ({
      modal: { active: false, state: '' },
    }));
  }

  handleChildClick(e) {
    e.stopPropagation();
  }

  render() {
    let galleryImgs =
      this.state.search !== ""
        ? this.state.images.filter((img) => img.label.match(this.state.search))
        : this.state.images;
    let gallery = galleryImgs.map((image) => {
      return (
        <div className="image">
          <img src={image.url} alt={image.label} width="100%" />
          <div className="image-overlay">
            <div
              className="smallBtn"
              imagenr={this.state.images.indexOf(image)}
              modalbtn="add"
              onClick={this.deleteModal}
            >
              Delete
            </div>
            <h4>{image.label}</h4>
          </div>
        </div>
      );
    });

    const breakpointColumnsObj = {
      default: 3,
      700: 2,
      500: 1,
    };

    return (
      <div id="container">
        {this.state.modal.active === true && (
          <div id="modal-container" onClick={this.closeModal}>
            {this.state.modal.state === "add" && (
              <div id="modal" onClick={this.handleChildClick}>
                <h3>Add a new photo</h3>
                <form onSubmit={this.addPhoto}>
                  <label>Label</label>
                  <input
                    type="text"
                    id="add-new-label"
                    placeholder="Deathly Romantic"
                    required
                  ></input>
                  <label>Photo URL</label>
                  <input
                    type="text"
                    id="add-new-photo-url"
                    placeholder="https://images.unsplash.com/photo-1635586668235-6e1457115785"
                    required
                  ></input>
                  <div className="modal-buttons">
                    <button
                      className="secondary-btn"
                      onClick={this.closeModal}
                      type="button"
                    >
                      Cancel
                    </button>
                    <button>Submit</button>
                  </div>
                </form>
              </div>
            )}
            {this.state.modal.state === "delete" && (
              <div id="modal" onClick={this.handleChildClick}>
                <h3>
                  Are you sure you want to delete "
                  {this.state.images[this.state.delete].label}"?
                </h3>
                <form onSubmit={this.deleteImg}>
                  <label>Password</label>
                  <input
                    type="password"
                    id="delete-password"
                    placeholder="**********"
                    required
                  ></input>
                  <input type="hidden" value={this.state.delete} />
                  <div className="modal-buttons">
                    <button
                      className="secondary-btn"
                      onClick={this.closeModal}
                      type="button"
                    >
                      Cancel
                    </button>
                    <button className="danger-btn">Delete</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
        <header>
          <div id="header-left">
            <img src={UnsplashLogo} alt="Unsplash Logo" height="30px" />
            <p>
              <strong>My Unsplash</strong>
              <br />
              devchallenges.io
            </p>
            <div className="icon-input">
              <input
                type="search"
                id="image-search"
                placeholder="Search by Label"
                onChange={this.search}
                value={this.state.search}
              ></input>
              <i className="fas fa-search"></i>
            </div>
          </div>
          <div id="header-right">
            <button id="add_photo" modalbtn="add" onClick={this.openModal}>
              Add a photo
            </button>
          </div>
        </header>
        <div id="content">
          {gallery.length === 0 ? (
            <div id="no-images">
              <h3>There are no images saved in this Gallery</h3>
            </div>
          ) : (
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {gallery}
            </Masonry>
          )}
        </div>
      </div>
    );
  }
}

export default Unsplash;
