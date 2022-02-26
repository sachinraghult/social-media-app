import React from "react";
import { Link } from "react-router-dom";
import "./Status.css";
function Status() {
  return (
    <div className="feed">
      <div className="feedWrapper">
        <b style={{ marginTop: "5px" }}>Status</b>
        <section class="stories">
          <Link to="/viewStatus" className="link">
            <div class="stories__item stories__item--active">
              <button>
                <div class="stories__item-picture">
                  <img
                    src="https://randomuser.me/api/portraits/women/90.jpg"
                    alt="gail_pena's profile picture"
                  />
                </div>
                <span class="stories__item-username">gail_pena</span>
              </button>
            </div>
          </Link>
          <div class="stories__item">
            <button>
              <div class="stories__item-picture">
                <img
                  src="https://randomuser.me/api/portraits/men/67.jpg"
                  alt="louis_larson's profile picture"
                />
              </div>
              <span class="stories__item-username">louis_larson</span>
            </button>
          </div>

          <div class="stories__item stories__item--active">
            <button>
              <div class="stories__item-picture">
                <img
                  src="https://randomuser.me/api/portraits/women/20.jpg"
                  alt="tonya_rodriquez's profile picture"
                />
              </div>
              <span class="stories__item-username">tonya_rodriquez</span>
            </button>
          </div>

          <div class="stories__item">
            <button>
              <div class="stories__item-picture">
                <img
                  src="https://randomuser.me/api/portraits/men/81.jpg"
                  alt="earl_martinez's profile picture"
                />
              </div>
              <span class="stories__item-username">earl_martinez</span>
            </button>
          </div>

          <div class="stories__item stories__item--active">
            <button>
              <div class="stories__item-picture">
                <img
                  src="https://randomuser.me/api/portraits/women/90.jpg"
                  alt="gail_pena's profile picture"
                />
              </div>
              <span class="stories__item-username">gail_pena</span>
            </button>
          </div>

          <div class="stories__item">
            <button>
              <div class="stories__item-picture">
                <img
                  src="https://randomuser.me/api/portraits/men/67.jpg"
                  alt="louis_larson's profile picture"
                />
              </div>
              <span class="stories__item-username">louis_larson</span>
            </button>
          </div>

          <div class="stories__item stories__item--active">
            <button>
              <div class="stories__item-picture">
                <img
                  src="https://randomuser.me/api/portraits/women/20.jpg"
                  alt="tonya_rodriquez's profile picture"
                />
              </div>
              <span class="stories__item-username">tonya_rodriquez</span>
            </button>
          </div>

          <div class="stories__item">
            <button>
              <div class="stories__item-picture">
                <img
                  src="https://randomuser.me/api/portraits/men/81.jpg"
                  alt="earl_martinez's profile picture"
                />
              </div>
              <span class="stories__item-username">earl_martinez</span>
            </button>
          </div>

          <div class="stories__item stories__item--active">
            <button>
              <div class="stories__item-picture">
                <img
                  src="https://randomuser.me/api/portraits/women/90.jpg"
                  alt="gail_pena's profile picture"
                />
              </div>
              <span class="stories__item-username">gail_pena</span>
            </button>
          </div>

          <div class="stories__item">
            <button>
              <div class="stories__item-picture">
                <img
                  src="https://randomuser.me/api/portraits/men/67.jpg"
                  alt="louis_larson's profile picture"
                />
              </div>
              <span class="stories__item-username">louis_larson</span>
            </button>
          </div>

          <div class="stories__item stories__item--active">
            <button>
              <div class="stories__item-picture">
                <img
                  src="https://randomuser.me/api/portraits/women/20.jpg"
                  alt="tonya_rodriquez's profile picture"
                />
              </div>
              <span class="stories__item-username">tonya_rodriquez</span>
            </button>
          </div>

          <div class="stories__item">
            <button>
              <div class="stories__item-picture">
                <img
                  src="https://randomuser.me/api/portraits/men/81.jpg"
                  alt="earl_martinez's profile picture"
                />
              </div>
              <span class="stories__item-username">earl_martinez</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Status;
