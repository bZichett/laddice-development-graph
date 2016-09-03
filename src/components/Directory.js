export default class Directory {

	constructor(){

		app.directory = this

		this.nodeNameSet = new Set()
		this.map = new Map()
		this.hierarchy = {}

	}


	set(path, value){
		var splitPath = path.split('/')

		var last = splitPath.pop().split('.')[0]

		//this.hierarchy[splitPath.join('/')] = {}

		var currentDirectory = false
		var ref;
		for(var i = 0; i < splitPath.length; i++){

			var folder = splitPath[i]

			if(i > 0) {
				currentDirectory = this.hierarchy

				//eslint-disable-next-line
				Array(i).fill().map((_, level) => {
					ref = currentDirectory[splitPath[level]]
					//console.log("Folder", folder, splitPath[level], level)
					if(!ref){
						currentDirectory[splitPath[level]] = {level: level}
					}
					return 1
				})

			} else {
				if(!this.hierarchy[folder]) this.hierarchy[folder] = {}
				currentDirectory = folder
			}



		}

		this.map.set(path, value)
		return {last, splitPath}
	}

	setHierarchyObjects(){
		Object.keys(this.hierarchy).forEach((key) => {
			this.hierarchy[key] = {
				//color:
			}
		})
	}

	has(key){
		return this.map.has(key)
	}

	get(key){
		return this.map.get(key)
	}

}