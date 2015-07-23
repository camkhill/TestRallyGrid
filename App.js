Ext.define('CustomApp', {
    extend: 'Rally.app.App',
    componentCls: 'app',
    launch: function() {
    
    	this.pulldownContainer = Ext.create('Ext.container.Container',{
    		layout: {
    	        type: 'hbox',
    	        align: 'stretch',
    	        padding: '10'
    	    },
    	});
    	
    	this.add(this.pulldownContainer);
    	this._loadIterations();
    	//this._loadData();
    
        //Write app code here
        
    },
    
    //Load all the data
    _loadData: function() {
    	var selIteration = this.iterationComboBox.getRecord().get('_ref');
    	var selSeverity = this.severityComboBox.getRecord().get('value');
    	
    	var myFilters = [
  		    {
		    	property: 'Iteration',
		    	operation: '=',
		    	value: selIteration
		    },
		    {
		    	property: 'Severity',
		    	operation: '=',
		    	value: selSeverity
		    }
    	];
    	
    	if (this.defectStore){
    		console.log('store exists');
    		this.defectStore.setFilter(myFilters);
    		this.defectStore.load();
    	} else {
    		console.log('creating new store');
    		this.defectStore = Ext.create('Rally.data.wsapi.Store', {
    			model: 'Defect',
    			autoLoad: true,
    			filters: myFilters,
    			listeners: {
    				load: function(myStore, myData, success) {
    					if(!this.myGrid){
    					this._loadGrid(myStore);
    					}       		
    				},
    				scope: this
    			},
    			fetch: ['FormattedID','Name','Severity','Iteration']
    		});
    	}
    },
    
    //Create grid
    _loadGrid: function(storyStore) {
    	this.myGrid = Ext.create('Rally.ui.grid.Grid', {
        	store: storyStore,
    	
        	columnCfgs: [
        		{dataIndex:'FormattedID', width: 200, text:'ID'}, 'Name', 'Severity', 'Iteration'
        	]
        });
    	
        this.add(this.myGrid); 
    },
    
    //Load the iteration
    _loadIterations: function() {
    	this.iterationComboBox = Ext.create('Rally.ui.combobox.IterationComboBox',{
    		fieldLabel: 'Pick an iteration',
    		labelAlign: 'right',
    		padding: '0 10 0 10',
    		width: 300,
    		listeners: {
    			ready: function(combobox){
    				this._loadSeverities();
    			},
    			
    			select: function(combobox, records){
    				this._loadData();
    				console.log('new iteration selected');
    			},
    			scope: this
    		}
    	});
    	this.pulldownContainer.add(this.iterationComboBox);
    	
    	
    },
    
    _loadSeverities: function() {
    	this.severityComboBox = Ext.create('Rally.ui.combobox.FieldValueComboBox',{
    		model: 'Defect',
    		field: 'Severity',
    		listeners: {
    			ready: function(combobox){
    				this._loadData();
    			},
    			select: function(combobox, records){
    				console.log('new severity selected');
    				this._loadData();
    			},
    			scope: this
    		}
    	});
    	this.pulldownContainer.add(this.severityComboBox);
    }
    
});
