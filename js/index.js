$( function ()
{
	var pin = {
		r:10,
		fill:'red',
		stroke:'red'
	};
	function getTransformation( transform )
	{
		// Create a dummy g for calculation purposes only. This will never
		// be appended to the DOM and will be discarded once this function
		// returns.
		var g = document.createElementNS( "http://www.w3.org/2000/svg", "g" );

		// Set the transform attribute to the provided string value.
		g.setAttributeNS( null, "transform", transform );

		// consolidate the SVGTransformList containing all transformations
		// to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
		// its SVGMatrix.
		var matrix = g.transform.baseVal.consolidate()
			.matrix;

		// Below calculations are taken and adapted from the private function
		// transform/decompose.js of D3's module d3-interpolate.
		var
		{
			a,
			b,
			c,
			d,
			e,
			f
		} = matrix; // ES6, if this doesn't work, use below assignment
		// var a=matrix.a, b=matrix.b, c=matrix.c, d=matrix.d, e=matrix.e, f=matrix.f; // ES5
		var scaleX, scaleY, skewX;
		if ( scaleX = Math.sqrt( a * a + b * b ) ) a /= scaleX, b /= scaleX;
		if ( skewX = a * c + b * d ) c -= a * skewX, d -= b * skewX;
		if ( scaleY = Math.sqrt( c * c + d * d ) ) c /= scaleY, d /= scaleY, skewX /= scaleY;
		if ( a * d < b * c ) a = -a, b = -b, skewX = -skewX, scaleX = -scaleX;
		return {
			translateX: e,
			translateY: f,
			rotate: Math.atan2( b, a ) * 180 / Math.PI,
			skewX: Math.atan( skewX ) * 180 / Math.PI,
			scaleX: scaleX,
			scaleY: scaleY
		};
	}

	function  drawCircle(node, x, y) {
		node
		.append("circle")
	    .attr("stroke", pin.stroke)
	    .attr("fill", pin.fill)
	    .attr("r", pin.r)
	    .attr("cx", x+pin.r)
	    .attr("cy", y+pin.r);
	}

	d3.xml( "https://raw.githubusercontent.com/1242035/cdn/master/floorplan.svg" )
		.mimeType( "image/svg+xml" )
		.get( function ( error, xml )
		{
			if ( error ) throw error;
			document.getElementById( 'svg' )
				.appendChild( xml.documentElement );
			var $root = document.getElementById( 'svg' );
			var svg = $root.querySelector( 'svg' );

			var $svg = $( svg );

			var top = $svg.offset()
				.top; // - (window.scrollY || window.pageYOffset || document.body.scrollTop);

			var left = $svg.offset()
				.left; // - (window.scrollX || window.pageXOffset || document.body.scrollLeft);
			var width = $svg.width();
			var height = $svg.height();

			if ( window.location.hash )
			{
				// Fragment exists
				var $hash = window.location.hash;

				var $element = d3.select( $hash );
				var $rect = d3.select( $hash + ' rect' );
				if( $element != null && $rect != null )
				{
					var $transform = $element.attr( 'transform' );
					var $matrix    = getTransformation( $transform );
					//console.log( $matrix );
					var rx = parseFloat( $rect.attr( 'x' ) );
					var ry = parseFloat( $rect.attr( 'y' ) );
					var rw = parseFloat( $rect.attr( 'width' ) );
					var rh = parseFloat( $rect.attr( 'height' ) );

					var scrollX = parseFloat( left ) + parseFloat( $matrix.translateX ) + parseFloat( rx ) + parseFloat( width );
					var scrollY = parseFloat( top ) + ( height - parseFloat( $matrix.translateY ) - parseFloat( ry ) - parseFloat( rh ) );
					drawCircle($element, parseFloat(rx), parseFloat(ry));
					window.scrollTo(scrollX, scrollY);
				}

			}

		} );
} );
