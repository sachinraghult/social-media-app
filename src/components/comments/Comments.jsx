import React from 'react';
import "./Comments.css";

function Comments() {
  return ( 
	<div className="container">
		<div className="col-md-12" id="fbcomment">
			<div className="header_comment">
				<div className="row">
					<div className="col-md-6 text-left">
					  <span className="count_comment">264235 Comments</span>
					</div>
					<div className="col-md-6 text-right">
					  <span className="sort_title">Sort by</span>
					  <select className="sort_by">
						<option>Top</option>
						<option>Newest</option>
						<option>Oldest</option>
					  </select>
					</div>
				</div>
			</div>

			<div className="body_comment">
				<div className="row">
					<div className="box_comment col-md-11">
					  <textarea className="commentar" placeholder="Add a comment..." ></textarea>
					  <div className="box_post">
						<div className="pull-right">
						  <span>
							<img src="https://static.xx.fbcdn.net/rsrc.php/v1/yi/r/odA9sNLrE86.jpg" alt="avatar" />
							<i className="fa fa-caret-down"></i>
						  </span>
						  <button type="button" value="1">Post</button>
						</div>
					  </div>
					</div>
				</div>
				<div className="row">
					<ul id="list_comment" className="col-md-12">
						<li className="box_result row">
							<div className="avatar_comment col-md-1">
								<img src="https://static.xx.fbcdn.net/rsrc.php/v1/yi/r/odA9sNLrE86.jpg" alt="avatar"/>
							</div>
							<div className="result_comment col-md-11">
								<h4 style={{marginLeft:"20px"}}>Nath Ryuzaki</h4>
								<p style={{marginLeft:"20px"}}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's.</p>
								<div className="tools_comment" style={{marginLeft:"20px"}}>
									<a className="like">Like</a>
									<span aria-hidden="true"> · </span>
									<a className="replay">Reply</a>
									<span aria-hidden="true"> · </span>
									<i className="fa fa-thumbs-o-up"></i> <span className="count">1</span> 
									<span aria-hidden="true"> · </span>
									<span>26m</span>
								</div>
                                <div className="box_comment col-md-11"  style={{marginLeft:"20px",marginTop:"10px"}}>
                                    <textarea className="commentar" placeholder="Add a comment..."></textarea>
                                    <div className="box_post">
                                        <div className="pull-right">
                                        <span>
                                            <img src="https://static.xx.fbcdn.net/rsrc.php/v1/yi/r/odA9sNLrE86.jpg" alt="avatar" />
                                            <i className="fa fa-caret-down"></i>
                                        </span>
                                        <button type="button" value="1">Post</button>
                                        </div>
                                    </div>
                                </div>
								<ul className="child_replay">
									<li className="box_reply row">
										<div className="avatar_comment col-md-1">
											<img src="https://static.xx.fbcdn.net/rsrc.php/v1/yi/r/odA9sNLrE86.jpg" alt="avatar"/>
										</div>
										 <div className="result_comment col-md-11">
											<h4 style={{marginLeft:"25px"}}>Sugito</h4>
											<p style={{marginLeft:"25px"}}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's.</p>
											<div className="tools_comment" style={{marginLeft:"25px"}}>
												<a className="like">Like</a>
												<span aria-hidden="true"> · </span>
												<a className="replay">Reply</a>
												<span aria-hidden="true"> · </span>
												<i className="fa fa-thumbs-o-up"></i> <span className="count">1</span> 
												<span aria-hidden="true"> · </span>
												<span>26m</span>
											</div>
                                            <div className="box_comment col-md-11"  style={{marginLeft:"25px",marginTop:"10px"}}>
                                                <textarea className="commentar" placeholder="Add a comment..." ></textarea>
                                                <div className="box_post">
                                                    <div className="pull-right">
                                                    <span>
                                                        <img src="https://static.xx.fbcdn.net/rsrc.php/v1/yi/r/odA9sNLrE86.jpg" alt="avatar" />
                                                        <i className="fa fa-caret-down"></i>
                                                    </span>
                                                    <button type="button" value="1">Post</button>
                                                    </div>
                                                </div>
                                            </div>
											<ul className="child_replay"></ul>
										</div>
									</li>
								</ul>
							</div>
						</li>
						
						<li className="box_result row">
							<div className="avatar_comment col-md-1">
								<img src="https://static.xx.fbcdn.net/rsrc.php/v1/yi/r/odA9sNLrE86.jpg" alt="avatar"/>
							</div>
							<div className="result_comment col-md-11">
								<h4 style={{marginLeft:"20px"}}>Gung Wah</h4>
								<p style={{marginLeft:"20px"}}>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's.</p>
								<div className="tools_comment" style={{marginLeft:"20px"}}>
									<a className="like">Like</a>
									<span aria-hidden="true"> · </span>
									<a className="replay">Reply</a>
									<span aria-hidden="true"> · </span>
									<i className="fa fa-thumbs-o-up"></i> <span className="count">1</span> 
									<span aria-hidden="true"> · </span>
									<span>26m</span>
								</div>
								<ul className="child_replay"></ul>
							</div>
						</li>
					</ul>
				<button className="show_more" type="button">Load 10 more comments</button>
				</div>
			</div>
		</div>
	</div>
  )
}

export default Comments
