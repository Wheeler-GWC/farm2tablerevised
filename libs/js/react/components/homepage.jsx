const HomepageComponent = React.createClass({
    render: function() {
        const titleStyle = {
            color: "red",
            fontFamily: "Arial"
        };
        return (
            <div>
                <h1 className="homepageTitle">Test Title 1</h1>
                <h1 style={titleStyle}>Test Title 2</h1>
            </div>
        );
    }
});

