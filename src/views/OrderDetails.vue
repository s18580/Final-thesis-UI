<template>
    <div>
        <div id="background">
            <div id="headerCo">
                <h1>Szczegóły zamówienia</h1>
                <va-divider /> 
            </div>
            <div id="orderDetailsCo">
                <h3>Dane zamówienia</h3>
                <va-divider />
                <div id="orderDetailsCoInner">
                    <div class="search-input-box">
                        <label>Zamówienie jest przetargiem:</label>
                        <div id="isAuctionCo">
                            <va-icon v-if="!isAuction" color="success" class="material-icons">done</va-icon>
                            <va-icon v-if="isAuction" color="danger" class="material-icons">close</va-icon>
                            <va-icon v-if="!readOnlyMode" @click="isAuction=!isAuction" color="primary" class="material-icons">cached</va-icon>
                        </div> 
                    </div>
                    <va-form @submit.prevent="this.submitForm()" id="form" tag="form" ref="form" @validation="isFormValidate = $event">
                        <va-input
                            class="inputWidth"
                            v-model="orderName"
                            :rules="[(v) => v.length > 0 || `Pole nazwa nie może być puste.`, (v) => v.length < 256 || `Pole nazwa przekroczyło limit znaków.`]"
                            label="Nazwa"
                            placeholder="Nazwa zamówienia"
                            :readonly = "readOnlyMode"
                        />
                        <va-input
                            class="inputWidth"
                            v-model="orderIdentifier"
                            label="Identyfikator"
                            placeholder="Identyfikator zamówienia"
                            readonly
                        />
                        <va-input
                            class="inputWidth"
                            v-model="orderNote"
                            type="textarea"
                            :rules="[(v) => v.length < 256 || `Pole notatka przekroczyło limit znaków.`]"
                            label="Notatka (opcjonalnie)"
                            :readonly = "readOnlyMode"
                        />
                        <va-date-input
                            class="inputWidth"
                            v-model="expectedDeliveryDate"
                            label="Przewidywana data dostawy"
                            placeholder="Pożądana data dostawy"
                            :readonly = "readOnlyMode"
                        />
                        <va-date-input
                            class="inputWidth"
                            v-model="deliveryDate"
                            label="Data dostawy"
                            placeholder="Data dostawy"
                            :readonly = "readOnlyMode"
                        />
                        <va-date-input
                            class="inputWidth"
                            v-model="creationDate"
                            label="Data stworzenia zamówienia"
                            readonly
                        />
                        <va-date-input
                            class="inputWidth"
                            v-model="offerValidityDate"
                            label="Termin ważności oferty"
                            placeholder="Termin ważności oferty"
                            :readonly = "readOnlyMode"
                        />
                        <va-date-input
                            class="inputWidth"
                            v-model="submissionDate"
                            label="Data złożenia zamówienia"
                            placeholder="Data złożenia zamówienia"
                            :readonly = "readOnlyMode"
                        />
                        <va-select
                            class="inputWidth"
                            v-model="selectedRepresentative"
                            :options="representatives"
                            label="Osoba kontaktowa"
                            noOptionsText="Brak osób do wybrania"
                            :readonly = "readOnlyMode"
                        />
                        <va-select
                            class="inputWidth"
                            v-model="selectedStatus"
                            :options="orderStatuses"
                            label="Status zamówienia"
                            noOptionsText="Brak statusów do wybrania"
                            :readonly = "readOnlyMode"
                        />
                        <va-button id="editButton" v-if="!readOnlyMode" @click="submitForm()" color="info" gradient class="my-3">Edytuj dane</va-button>
                    </va-form>
                </div>
            </div>
            <div id="orderItemsCo">
                <h3>Przedmioty zamówienia</h3>
                <va-divider />
                <div id="orderItemsCoInner">
                    <va-list>
                        <va-list-label>
                            Przedmioty zamówienia
                        </va-list-label>

                        <va-list-item
                            v-for="item in orderItems"
                            :key="item.idOrderItem"
                        >
                            <va-list-item-section avatar>
                                <va-avatar color="#6B5B95" icon="inventory_2" />
                            </va-list-item-section>

                            <va-list-item-section>
                                <va-list-item-label>
                                    {{ item.name }}
                                </va-list-item-label>
                            </va-list-item-section>

                            <va-list-item-section icon v-if="!readOnlyMode">
                                <va-popover message="Edytuj przemiot zamówienia">
                                    <va-button flat icon="edit" @click="openEditOrderItem(item)" />
                                </va-popover>
                                <va-popover message="Usuń przemiot zamówienia">
                                    <va-button flat icon="delete" @click="openDeleteOrderItemModal(item)" />
                                </va-popover>
                            </va-list-item-section>
                        </va-list-item>
                    </va-list>
                    <va-button v-if="!readOnlyMode" @click="showOrderItemModal=true" type="button" color="success" gradient>Dodaj przedmiot zamówienia</va-button>
                    <OrderItemModal :orderItem="selectedOrderItem" v-if="showOrderItemModal" @close="closeEditOrderItem()" @editOrderItem="editOrderItem($event)" @createOrderItem="addOrderItem($event)" />
                    <va-modal
                        v-model="showDeleteOrderItemModal"
                        message="Czy napewno chcesz usunąć ten adres ?"
                        size="small"
                        title="Usuń adres"
                        cancel-text="Anuluj"
                        ok-text="Usuń"
                        @cancel="closeDeleteOrderItemModal()"
                        @click-outside="closeDeleteOrderItemModal()"
                        @ok="deleteOrderItem()"
                    />
                </div>
            </div>
            <div id="filesCo">
                <h3>Pliki dotyczące zamówienia</h3>
                <va-divider />
                <div id="filesCoInner" class="file-container-wrapper">
					<div class="file-container">
						<div v-for="file in files" :key="file.Key" class="file-item">
                            <va-icon v-if="!readOnlyMode" color="danger" name="close" id="deleteFile" @click="deleteFile(file)"/>
                            <div class="file-icons-wrapper">
                                <div class="file-icons">
                                    <svg v-if="file.fileIcon==='none'" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-file-earmark" viewBox="0 0 16 16">
                                        <path d="M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z"/>
                                    </svg>
                                    <svg v-if="file.fileIcon==='csv'" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-filetype-csv" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM3.517 14.841a1.13 1.13 0 0 0 .401.823c.13.108.289.192.478.252.19.061.411.091.665.091.338 0 .624-.053.859-.158.236-.105.416-.252.539-.44.125-.189.187-.408.187-.656 0-.224-.045-.41-.134-.56a1.001 1.001 0 0 0-.375-.357 2.027 2.027 0 0 0-.566-.21l-.621-.144a.97.97 0 0 1-.404-.176.37.37 0 0 1-.144-.299c0-.156.062-.284.185-.384.125-.101.296-.152.512-.152.143 0 .266.023.37.068a.624.624 0 0 1 .246.181.56.56 0 0 1 .12.258h.75a1.092 1.092 0 0 0-.2-.566 1.21 1.21 0 0 0-.5-.41 1.813 1.813 0 0 0-.78-.152c-.293 0-.551.05-.776.15-.225.099-.4.24-.527.421-.127.182-.19.395-.19.639 0 .201.04.376.122.524.082.149.2.27.352.367.152.095.332.167.539.213l.618.144c.207.049.361.113.463.193a.387.387 0 0 1 .152.326.505.505 0 0 1-.085.29.559.559 0 0 1-.255.193c-.111.047-.249.07-.413.07-.117 0-.223-.013-.32-.04a.838.838 0 0 1-.248-.115.578.578 0 0 1-.255-.384h-.765ZM.806 13.693c0-.248.034-.46.102-.633a.868.868 0 0 1 .302-.399.814.814 0 0 1 .475-.137c.15 0 .283.032.398.097a.7.7 0 0 1 .272.26.85.85 0 0 1 .12.381h.765v-.072a1.33 1.33 0 0 0-.466-.964 1.441 1.441 0 0 0-.489-.272 1.838 1.838 0 0 0-.606-.097c-.356 0-.66.074-.911.223-.25.148-.44.359-.572.632-.13.274-.196.6-.196.979v.498c0 .379.064.704.193.976.131.271.322.48.572.626.25.145.554.217.914.217.293 0 .554-.055.785-.164.23-.11.414-.26.55-.454a1.27 1.27 0 0 0 .226-.674v-.076h-.764a.799.799 0 0 1-.118.363.7.7 0 0 1-.272.25.874.874 0 0 1-.401.087.845.845 0 0 1-.478-.132.833.833 0 0 1-.299-.392 1.699 1.699 0 0 1-.102-.627v-.495Zm8.239 2.238h-.953l-1.338-3.999h.917l.896 3.138h.038l.888-3.138h.879l-1.327 4Z"/>
                                    </svg>
                                    <svg v-if="file.fileIcon==='doc'" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-filetype-doc" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2v-1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5Zm-7.839 9.166v.522c0 .256-.039.47-.117.641a.861.861 0 0 1-.322.387.877.877 0 0 1-.469.126.883.883 0 0 1-.471-.126.868.868 0 0 1-.32-.386 1.55 1.55 0 0 1-.117-.642v-.522c0-.257.04-.471.117-.641a.868.868 0 0 1 .32-.387.868.868 0 0 1 .471-.129c.176 0 .332.043.469.13a.861.861 0 0 1 .322.386c.078.17.117.384.117.641Zm.803.519v-.513c0-.377-.068-.7-.205-.972a1.46 1.46 0 0 0-.589-.63c-.254-.147-.56-.22-.917-.22-.355 0-.662.073-.92.22a1.441 1.441 0 0 0-.589.627c-.136.271-.205.596-.205.975v.513c0 .375.069.7.205.973.137.271.333.48.59.627.257.144.564.216.92.216.357 0 .662-.072.916-.216.256-.147.452-.356.59-.627.136-.274.204-.598.204-.973ZM0 11.926v4h1.459c.402 0 .735-.08.999-.238a1.45 1.45 0 0 0 .595-.689c.13-.3.196-.662.196-1.084 0-.42-.065-.778-.196-1.075a1.426 1.426 0 0 0-.59-.68c-.263-.156-.598-.234-1.004-.234H0Zm.791.645h.563c.248 0 .45.05.609.152a.89.89 0 0 1 .354.454c.079.201.118.452.118.753a2.3 2.3 0 0 1-.068.592 1.141 1.141 0 0 1-.196.422.8.8 0 0 1-.334.252 1.298 1.298 0 0 1-.483.082H.79V12.57Zm7.422.483a1.732 1.732 0 0 0-.103.633v.495c0 .246.034.455.103.627a.834.834 0 0 0 .298.393.845.845 0 0 0 .478.131.868.868 0 0 0 .401-.088.699.699 0 0 0 .273-.248.8.8 0 0 0 .117-.364h.765v.076a1.268 1.268 0 0 1-.226.674c-.137.194-.32.345-.55.454a1.81 1.81 0 0 1-.786.164c-.36 0-.664-.072-.914-.216a1.424 1.424 0 0 1-.571-.627c-.13-.272-.194-.597-.194-.976v-.498c0-.379.066-.705.197-.978.13-.274.321-.485.571-.633.252-.149.556-.223.911-.223.219 0 .421.032.607.097.187.062.35.153.489.272a1.326 1.326 0 0 1 .466.964v.073H9.78a.85.85 0 0 0-.12-.38.7.7 0 0 0-.273-.261.802.802 0 0 0-.398-.097.814.814 0 0 0-.475.138.868.868 0 0 0-.301.398Z"/>
                                    </svg>
                                    <svg v-if="file.fileIcon==='docx'" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-filetype-docx" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5Zm-6.839 9.688v-.522a1.54 1.54 0 0 0-.117-.641.861.861 0 0 0-.322-.387.862.862 0 0 0-.469-.129.868.868 0 0 0-.471.13.868.868 0 0 0-.32.386 1.54 1.54 0 0 0-.117.641v.522c0 .256.04.47.117.641a.868.868 0 0 0 .32.387.883.883 0 0 0 .471.126.877.877 0 0 0 .469-.126.861.861 0 0 0 .322-.386 1.55 1.55 0 0 0 .117-.642Zm.803-.516v.513c0 .375-.068.7-.205.973a1.47 1.47 0 0 1-.589.627c-.254.144-.56.216-.917.216a1.86 1.86 0 0 1-.92-.216 1.463 1.463 0 0 1-.589-.627 2.151 2.151 0 0 1-.205-.973v-.513c0-.379.069-.704.205-.975.137-.274.333-.483.59-.627.257-.147.564-.22.92-.22.357 0 .662.073.916.22.256.146.452.356.59.63.136.271.204.595.204.972ZM1 15.925v-3.999h1.459c.406 0 .741.078 1.005.235.264.156.46.382.589.68.13.296.196.655.196 1.074 0 .422-.065.784-.196 1.084-.131.301-.33.53-.595.689-.264.158-.597.237-.999.237H1Zm1.354-3.354H1.79v2.707h.563c.185 0 .346-.028.483-.082a.8.8 0 0 0 .334-.252c.088-.114.153-.254.196-.422a2.3 2.3 0 0 0 .068-.592c0-.3-.04-.552-.118-.753a.89.89 0 0 0-.354-.454c-.158-.102-.361-.152-.61-.152Zm6.756 1.116c0-.248.034-.46.103-.633a.868.868 0 0 1 .301-.398.814.814 0 0 1 .475-.138c.15 0 .283.032.398.097a.7.7 0 0 1 .273.26.85.85 0 0 1 .12.381h.765v-.073a1.33 1.33 0 0 0-.466-.964 1.44 1.44 0 0 0-.49-.272 1.836 1.836 0 0 0-.606-.097c-.355 0-.66.074-.911.223-.25.148-.44.359-.571.633-.131.273-.197.6-.197.978v.498c0 .379.065.704.194.976.13.271.321.48.571.627.25.144.555.216.914.216.293 0 .555-.054.785-.164.23-.11.414-.26.551-.454a1.27 1.27 0 0 0 .226-.674v-.076h-.765a.8.8 0 0 1-.117.364.699.699 0 0 1-.273.248.874.874 0 0 1-.401.088.845.845 0 0 1-.478-.131.834.834 0 0 1-.298-.393 1.7 1.7 0 0 1-.103-.627v-.495Zm5.092-1.76h.894l-1.275 2.006 1.254 1.992h-.908l-.85-1.415h-.035l-.852 1.415h-.862l1.24-2.015-1.228-1.984h.932l.832 1.439h.035l.823-1.439Z"/>
                                    </svg>
                                    <svg v-if="file.fileIcon==='tiff'" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-filetype-tiff" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM1.928 12.512v3.337h-.794v-3.337H0v-.662h3.064v.662H1.928Zm2.131-.662v3.999h-.79V11.85h.79Zm1.373 3.999v-1.59h1.606v-.64H5.432v-1.116H7.19v-.653H4.641v3.999h.791Zm2.868-1.59v1.59h-.791V11.85h2.548v.653H8.3v1.117h1.605v.638H8.3Z"/>
                                    </svg>
                                    <svg v-if="file.fileIcon==='bmp'" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-filetype-bmp" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2v-1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM0 15.849h1.664c.272 0 .512-.044.72-.132.21-.09.374-.219.493-.386.12-.168.179-.372.179-.61a.986.986 0 0 0-.123-.51.846.846 0 0 0-.323-.325 1.084 1.084 0 0 0-.445-.14v-.036a1 1 0 0 0 .352-.16.79.79 0 0 0 .243-.294.932.932 0 0 0 .09-.422c0-.308-.107-.55-.322-.723-.215-.174-.5-.261-.858-.261H0v3.999Zm.785-3.404h.7c.186 0 .33.047.431.14.104.092.155.22.155.384a.52.52 0 0 1-.082.296.497.497 0 0 1-.249.185 1.222 1.222 0 0 1-.433.064H.785v-1.07Zm0 1.62h.75c.154 0 .285.024.393.073a.51.51 0 0 1 .24.211.61.61 0 0 1 .082.325c0 .19-.068.334-.205.434-.137.098-.36.146-.671.146H.785v-1.19Zm3.474 1.784v-2.66h.038l.952 2.16h.515l.947-2.16h.038v2.66h.715V11.85h-.8l-1.14 2.596h-.026l-1.14-2.596h-.805v3.999h.706Zm3.918-3.999h1.6c.289 0 .533.06.732.179.201.117.355.276.46.477.106.201.159.427.159.677 0 .25-.054.476-.162.677-.105.199-.26.357-.462.474a1.452 1.452 0 0 1-.733.173h-.803v1.342h-.79V11.85Zm2.06 1.714a.794.794 0 0 0 .085-.381c0-.226-.062-.4-.185-.521-.123-.122-.294-.182-.512-.182h-.66v1.406h.66a.794.794 0 0 0 .375-.082.574.574 0 0 0 .237-.24Z"/>
                                    </svg>
                                    <svg v-if="file.fileIcon==='ai'" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-filetype-ai" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2H6v-1h6a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM1.113 14.82.8 15.85H0l1.342-3.999h.926l1.336 3.999h-.841l-.314-1.028H1.113Zm1.178-.588-.49-1.617h-.034l-.49 1.617h1.014Zm2.425-2.382v3.999h-.791V11.85h.79Z"/>
                                    </svg>
                                    <svg v-if="file.fileIcon==='jpg'" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-filetype-jpg" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5Zm-4.34 8.132c.076.153.123.317.14.492h-.776a.797.797 0 0 0-.097-.249.689.689 0 0 0-.17-.19.707.707 0 0 0-.237-.126.96.96 0 0 0-.299-.044c-.285 0-.507.1-.665.302-.156.201-.234.484-.234.85v.498c0 .234.032.439.097.615a.881.881 0 0 0 .304.413.87.87 0 0 0 .519.146.967.967 0 0 0 .457-.096.67.67 0 0 0 .272-.264c.06-.11.091-.23.091-.363v-.255H8.24v-.59h1.576v.798c0 .193-.032.377-.097.55a1.29 1.29 0 0 1-.293.458 1.37 1.37 0 0 1-.495.313c-.197.074-.43.111-.697.111a1.98 1.98 0 0 1-.753-.132 1.447 1.447 0 0 1-.533-.377 1.58 1.58 0 0 1-.32-.58 2.482 2.482 0 0 1-.105-.745v-.506c0-.362.066-.678.2-.95.134-.271.328-.482.582-.633.256-.152.565-.228.926-.228.238 0 .45.033.636.1.187.066.347.158.48.275.133.117.238.253.314.407ZM0 14.786c0 .164.027.319.082.465.055.147.136.277.243.39.11.113.245.202.407.267.164.062.354.093.569.093.42 0 .748-.115.984-.345.238-.23.358-.566.358-1.005v-2.725h-.791v2.745c0 .202-.046.357-.138.466-.092.11-.233.164-.422.164a.499.499 0 0 1-.454-.246.577.577 0 0 1-.073-.27H0Zm4.92-2.86H3.322v4h.791v-1.343h.803c.287 0 .531-.057.732-.172.203-.118.358-.276.463-.475.108-.201.161-.427.161-.677 0-.25-.052-.475-.158-.677a1.176 1.176 0 0 0-.46-.477c-.2-.12-.443-.179-.732-.179Zm.546 1.333a.795.795 0 0 1-.085.381.574.574 0 0 1-.238.24.794.794 0 0 1-.375.082H4.11v-1.406h.66c.218 0 .389.06.512.182.123.12.185.295.185.521Z"/>
                                    </svg>
                                    <svg v-if="file.fileIcon==='gif'" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-filetype-gif" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2H9v-1h3a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM3.278 13.124a1.403 1.403 0 0 0-.14-.492 1.317 1.317 0 0 0-.314-.407 1.447 1.447 0 0 0-.48-.275 1.88 1.88 0 0 0-.636-.1c-.361 0-.67.076-.926.229a1.48 1.48 0 0 0-.583.632 2.136 2.136 0 0 0-.199.95v.506c0 .272.035.52.105.745.07.224.177.417.32.58.142.162.32.288.533.377.215.088.466.132.753.132.268 0 .5-.037.697-.111a1.29 1.29 0 0 0 .788-.77c.065-.174.097-.358.097-.551v-.797H1.717v.589h.823v.255c0 .132-.03.254-.09.363a.67.67 0 0 1-.273.264.967.967 0 0 1-.457.096.87.87 0 0 1-.519-.146.881.881 0 0 1-.305-.413 1.785 1.785 0 0 1-.096-.615v-.499c0-.365.078-.648.234-.85.158-.2.38-.301.665-.301a.96.96 0 0 1 .3.044c.09.03.17.071.236.126a.689.689 0 0 1 .17.19.797.797 0 0 1 .097.25h.776Zm1.353 2.801v-3.999H3.84v4h.79Zm1.493-1.59v1.59h-.791v-3.999H7.88v.653H6.124v1.117h1.605v.638H6.124Z"/>
                                    </svg>
                                    <svg v-if="file.fileIcon==='xls'" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-filetype-xls" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM6.472 15.29a1.176 1.176 0 0 1-.111-.449h.765a.578.578 0 0 0 .254.384c.07.049.154.087.25.114.095.028.202.041.319.041.164 0 .302-.023.413-.07a.559.559 0 0 0 .255-.193.507.507 0 0 0 .085-.29.387.387 0 0 0-.153-.326c-.101-.08-.255-.144-.462-.193l-.619-.143a1.72 1.72 0 0 1-.539-.214 1.001 1.001 0 0 1-.351-.367 1.068 1.068 0 0 1-.123-.524c0-.244.063-.457.19-.639.127-.181.303-.322.527-.422.225-.1.484-.149.777-.149.305 0 .564.05.78.152.216.102.383.239.5.41.12.17.186.359.2.566h-.75a.56.56 0 0 0-.12-.258.625.625 0 0 0-.247-.181.923.923 0 0 0-.369-.068c-.217 0-.388.05-.513.152a.472.472 0 0 0-.184.384c0 .121.048.22.143.3a.97.97 0 0 0 .405.175l.62.143c.217.05.406.12.566.211a1 1 0 0 1 .375.358c.09.148.135.335.135.56 0 .247-.063.466-.188.656a1.216 1.216 0 0 1-.539.439c-.234.105-.52.158-.858.158-.254 0-.476-.03-.665-.09a1.404 1.404 0 0 1-.478-.252 1.13 1.13 0 0 1-.29-.375Zm-2.945-3.358h-.893L1.81 13.37h-.036l-.832-1.438h-.93l1.227 1.983L0 15.931h.861l.853-1.415h.035l.85 1.415h.908L2.253 13.94l1.274-2.007Zm2.727 3.325H4.557v-3.325h-.79v4h2.487v-.675Z"/>
                                    </svg>
                                    <svg v-if="file.fileIcon==='xlsx'" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-filetype-xlsx" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M14 4.5V11h-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM7.86 14.841a1.13 1.13 0 0 0 .401.823c.13.108.29.192.479.252.19.061.411.091.665.091.338 0 .624-.053.858-.158.237-.105.416-.252.54-.44a1.17 1.17 0 0 0 .187-.656c0-.224-.045-.41-.135-.56a1.002 1.002 0 0 0-.375-.357 2.028 2.028 0 0 0-.565-.21l-.621-.144a.97.97 0 0 1-.405-.176.37.37 0 0 1-.143-.299c0-.156.061-.284.184-.384.125-.101.296-.152.513-.152.143 0 .266.023.37.068a.624.624 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.093 1.093 0 0 0-.199-.566 1.21 1.21 0 0 0-.5-.41 1.813 1.813 0 0 0-.78-.152c-.293 0-.552.05-.777.15-.224.099-.4.24-.527.421-.127.182-.19.395-.19.639 0 .201.04.376.123.524.082.149.199.27.351.367.153.095.332.167.54.213l.618.144c.207.049.36.113.462.193a.387.387 0 0 1 .153.326.512.512 0 0 1-.085.29.558.558 0 0 1-.255.193c-.111.047-.25.07-.413.07-.117 0-.224-.013-.32-.04a.837.837 0 0 1-.249-.115.578.578 0 0 1-.255-.384h-.764Zm-3.726-2.909h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415H1.5l1.24-2.016-1.228-1.983h.931l.832 1.438h.036l.823-1.438Zm1.923 3.325h1.697v.674H5.266v-3.999h.791v3.325Zm7.636-3.325h.893l-1.274 2.007 1.254 1.992h-.908l-.85-1.415h-.035l-.853 1.415h-.861l1.24-2.016-1.228-1.983h.931l.832 1.438h.036l.823-1.438Z"/>
                                    </svg>
                                    <svg v-if="file.Key.endsWith('png')" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-filetype-png" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2v-1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5Zm-3.76 8.132c.076.153.123.317.14.492h-.776a.797.797 0 0 0-.097-.249.689.689 0 0 0-.17-.19.707.707 0 0 0-.237-.126.96.96 0 0 0-.299-.044c-.285 0-.506.1-.665.302-.156.201-.234.484-.234.85v.498c0 .234.032.439.097.615a.881.881 0 0 0 .304.413.87.87 0 0 0 .519.146.967.967 0 0 0 .457-.096.67.67 0 0 0 .272-.264c.06-.11.091-.23.091-.363v-.255H8.82v-.59h1.576v.798c0 .193-.032.377-.097.55a1.29 1.29 0 0 1-.293.458 1.37 1.37 0 0 1-.495.313c-.197.074-.43.111-.697.111a1.98 1.98 0 0 1-.753-.132 1.447 1.447 0 0 1-.533-.377 1.58 1.58 0 0 1-.32-.58 2.482 2.482 0 0 1-.105-.745v-.506c0-.362.067-.678.2-.95.134-.271.328-.482.582-.633.256-.152.565-.228.926-.228.238 0 .45.033.636.1.187.066.348.158.48.275.133.117.238.253.314.407Zm-8.64-.706H0v4h.791v-1.343h.803c.287 0 .531-.057.732-.172.203-.118.358-.276.463-.475a1.42 1.42 0 0 0 .161-.677c0-.25-.053-.475-.158-.677a1.176 1.176 0 0 0-.46-.477c-.2-.12-.443-.179-.732-.179Zm.545 1.333a.795.795 0 0 1-.085.381.574.574 0 0 1-.238.24.794.794 0 0 1-.375.082H.788v-1.406h.66c.218 0 .389.06.512.182.123.12.185.295.185.521Zm1.964 2.666V13.25h.032l1.761 2.675h.656v-3.999h-.75v2.66h-.032l-1.752-2.66h-.662v4h.747Z"/>
                                    </svg>
                                    <svg v-if="file.fileIcon==='pdf'" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-filetype-pdf" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-1v-1h1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM1.6 11.85H0v3.999h.791v-1.342h.803c.287 0 .531-.057.732-.173.203-.117.358-.275.463-.474a1.42 1.42 0 0 0 .161-.677c0-.25-.053-.476-.158-.677a1.176 1.176 0 0 0-.46-.477c-.2-.12-.443-.179-.732-.179Zm.545 1.333a.795.795 0 0 1-.085.38.574.574 0 0 1-.238.241.794.794 0 0 1-.375.082H.788V12.48h.66c.218 0 .389.06.512.181.123.122.185.296.185.522Zm1.217-1.333v3.999h1.46c.401 0 .734-.08.998-.237a1.45 1.45 0 0 0 .595-.689c.13-.3.196-.662.196-1.084 0-.42-.065-.778-.196-1.075a1.426 1.426 0 0 0-.589-.68c-.264-.156-.599-.234-1.005-.234H3.362Zm.791.645h.563c.248 0 .45.05.609.152a.89.89 0 0 1 .354.454c.079.201.118.452.118.753a2.3 2.3 0 0 1-.068.592 1.14 1.14 0 0 1-.196.422.8.8 0 0 1-.334.252 1.298 1.298 0 0 1-.483.082h-.563v-2.707Zm3.743 1.763v1.591h-.79V11.85h2.548v.653H7.896v1.117h1.606v.638H7.896Z"/>
                                    </svg>
                                    <svg v-if="file.fileIcon==='svg'" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-filetype-svg" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2v-1a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM0 14.841a1.13 1.13 0 0 0 .401.823c.13.108.288.192.478.252.19.061.411.091.665.091.338 0 .624-.053.858-.158.237-.105.416-.252.54-.44a1.17 1.17 0 0 0 .187-.656c0-.224-.045-.41-.135-.56a1 1 0 0 0-.375-.357 2.027 2.027 0 0 0-.565-.21l-.621-.144a.97.97 0 0 1-.405-.176.37.37 0 0 1-.143-.299c0-.156.061-.284.184-.384.125-.101.296-.152.513-.152.143 0 .266.023.37.068a.625.625 0 0 1 .245.181.56.56 0 0 1 .12.258h.75a1.092 1.092 0 0 0-.199-.566 1.21 1.21 0 0 0-.5-.41 1.813 1.813 0 0 0-.78-.152c-.293 0-.552.05-.776.15-.225.099-.4.24-.528.421-.127.182-.19.395-.19.639 0 .201.04.376.123.524.082.149.199.27.351.367.153.095.332.167.54.213l.618.144c.207.049.36.113.462.193a.387.387 0 0 1 .153.326.512.512 0 0 1-.085.29.559.559 0 0 1-.256.193c-.111.047-.249.07-.413.07-.117 0-.224-.013-.32-.04a.837.837 0 0 1-.248-.115.578.578 0 0 1-.255-.384H0Zm4.575 1.09h.952l1.327-3.999h-.879l-.887 3.138H5.05l-.897-3.138h-.917l1.339 4Zm5.483-3.293c.076.152.123.316.14.492h-.776a.797.797 0 0 0-.096-.249.689.689 0 0 0-.17-.19.707.707 0 0 0-.237-.126.963.963 0 0 0-.3-.044c-.284 0-.506.1-.664.302-.157.2-.235.484-.235.85v.497c0 .235.033.44.097.616a.881.881 0 0 0 .305.413.87.87 0 0 0 .518.146.965.965 0 0 0 .457-.097.67.67 0 0 0 .273-.263c.06-.11.09-.23.09-.364v-.254h-.823v-.59h1.576v.798c0 .193-.032.377-.096.55a1.29 1.29 0 0 1-.293.457 1.37 1.37 0 0 1-.495.314c-.198.074-.43.111-.698.111a1.98 1.98 0 0 1-.752-.132 1.447 1.447 0 0 1-.534-.377 1.58 1.58 0 0 1-.319-.58 2.482 2.482 0 0 1-.105-.745v-.507c0-.36.066-.677.199-.949.134-.271.329-.482.583-.633.256-.152.564-.228.926-.228.238 0 .45.033.635.1.188.066.348.158.48.275.134.117.238.253.314.407Z"/>
                                    </svg>
                                    <svg v-if="file.fileIcon==='txt'" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-filetype-txt" viewBox="0 0 16 16">
                                        <path fill-rule="evenodd" d="M14 4.5V14a2 2 0 0 1-2 2h-2v-1h2a1 1 0 0 0 1-1V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v9H2V2a2 2 0 0 1 2-2h5.5L14 4.5ZM1.928 15.849v-3.337h1.136v-.662H0v.662h1.134v3.337h.794Zm4.689-3.999h-.894L4.9 13.289h-.035l-.832-1.439h-.932l1.228 1.983-1.24 2.016h.862l.853-1.415h.035l.85 1.415h.907l-1.253-1.992 1.274-2.007Zm1.93.662v3.337h-.794v-3.337H6.619v-.662h3.064v.662H8.546Z"/>
                                    </svg>
                                </div>
                                <div>
                                    {{ removeExtension(file.Key) }}
                                </div>
                            </div>
						</div>
					</div>
                    <va-button v-if="!readOnlyMode" @click="showFileModal=true" type="button" color="success" gradient>Dodaj plik</va-button>
                    <FileModal v-if="showFileModal" @close="closeFileModal()" @createFile="addFile($event)"/>
				</div>
            </div>
            <div id="workersCo">
                <h3>Przypisani pracownicy</h3>
                <va-divider />
                <div id="workersCoInner">
                    <va-list>
                        <va-list-label>
                            Pracownicy
                        </va-list-label>

                        <va-list-item
                            v-for="assignment in assignments"
                            :key="assignment.IdWorker"
                        >
                            <va-list-item-section avatar>
                                <va-avatar color="#6B5B95" icon="face" />
                            </va-list-item-section>

                            <va-list-item-section>
                                <va-list-item-label>
                                    {{ assignment.worker.name + " " + assignment.worker.lastName }}
                                </va-list-item-label>

                                <va-list-item-label caption>
                                    {{ getWorksiteName(assignment) }}
                                </va-list-item-label>
                            </va-list-item-section>

                            <va-list-item-section icon v-if="!readOnlyMode">
                                <va-popover message="Edytuj przypisanie">
                                    <va-button flat icon="edit" @click="openEditAssignment(assignment)" />
                                </va-popover>
                                <va-popover message="Usuń przypisanie">
                                    <va-button flat icon="delete" @click="openDeleteAssignmentModal(assignment)" />
                                </va-popover>
                            </va-list-item-section>
                        </va-list-item>
                    </va-list>
                    <va-button v-if="!readOnlyMode" @click="showAssignmentsModal=true" type="button" color="success" gradient>Przypisz pracownika</va-button>
                    <WorkerModal :worker="selectedAssignment" v-if="showAssignmentsModal" @close="closeAssignmentModal()" @createWorker="addAssignment($event)" @editWorker="editAssignment($event)"/>
                    <va-modal
                        v-model="showDeleteAssignmentModal"
                        message="Czy napewno chcesz usunąć to przypisanie ?"
                        size="small"
                        title="Usuń przypisanie"
                        cancel-text="Anuluj"
                        ok-text="Usuń"
                        @cancel="closeDeleteAssignmentModal()"
                        @click-outside="closeDeleteAssignmentModal()"
                        @ok="deleteAssignment()"
                    />
                </div>
            </div>
            <div id="addressesCo">
                <h3>Adresy dostawy</h3>
                <va-divider />
                <div id="addressesCoInner">
                    <va-list>
                        <va-list-label>
                            Adresy
                        </va-list-label>

                        <va-list-item
                            v-for="address in addresses"
                            :key="address.idDeliveriesAddresses"
                        >
                            <va-list-item-section avatar>
                                <va-avatar color="#6B5B95" icon="local_shipping" />
                            </va-list-item-section>

                            <va-list-item-section>
                                <va-list-item-label>
                                    {{ address.address.name }}
                                </va-list-item-label>

                                <va-list-item-label caption>
                                    {{ address.address.streetName + " " + address.address.streetNumber }}
                                </va-list-item-label>
                            </va-list-item-section>

                            <va-list-item-section icon v-if="!readOnlyMode">
                                <va-popover message="Usuń adres">
                                    <va-button flat icon="delete" @click="openDeleteAddressModal(address)" />
                                </va-popover>
                            </va-list-item-section>
                        </va-list-item>
                    </va-list>
                    <va-button v-if="!readOnlyMode" @click="showAddressesModal=true" type="button" color="success" gradient>Przydziel adres dostawy</va-button>
                    <DeliveryAddress :idCustomer="idCustomer" v-if="showAddressesModal" @createDeliveryAddress="addAddress($event)" @close="closeAddressModal()" />
                    <va-modal
                        v-model="showDeleteAddressModal"
                        message="Czy napewno chcesz usunąć ten adres ?"
                        size="small"
                        title="Usuń adres"
                        cancel-text="Anuluj"
                        ok-text="Usuń"
                        @cancel="closeDeleteAddressModal()"
                        @click-outside="closeDeleteAddressModal()"
                        @ok="deleteAddress()"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import CallAPI from '@/axios/axios-connection.js';
import CallSeq from '@/logging/seq-logger.js';
import DeliveryAddress from '@/components/ReuseComponents/Modals/DeliveryAddress.vue';
import FileModal from '@/components/ReuseComponents/Modals/FileModal.vue';
import WorkerModal from '@/components/ReuseComponents/Modals/WorkerModal.vue';
import OrderItemModal from '@/components/ReuseComponents/Modals/OrderItemModal.vue';
import { S3Client, ListObjectsCommand, DeleteObjectsCommand } from "@aws-sdk/client-s3";

export default {
    name: "OrderDetails",
    props: {
        id: {
            type: String,
            required: true,
        },
        mode: {
            type: String,
            required: false,
            default: "read"
        },
    },
    components: { FileModal, WorkerModal, DeliveryAddress, OrderItemModal },
    data() {
        return {
            readOnlyMode: false,
            deleteModalMessage: "",
            deleteModalTitle: "",

            isAuction: false,
            orderName: "",
            orderIdentifier: "",
            orderNote: "",
            creationDate: null,
            expectedDeliveryDate: null,
            deliveryDate: null,
            offerValidityDate: null,
            submissionDate: null,
            selectedRepresentative: "",
            rawRepresentatives: [],
            idCustomer: null,
            selectedStatus: "",
            rawOrderStatuses: [],
            isFormValidate: false,

            showDeleteAddressModal: false,
            showAddressesModal: false,
            selectedAddress: null,
            addresses: [],

            showDeleteOrderItemModal: false,
            showOrderItemModal: false,
            selectedOrderItem: null,
            orderItems: [],

            showDeleteAssignmentModal: false,
            showAssignmentsModal: false,
            selectedAssignment: null,
            workers: [],
            assignments: [],

            showFileModal: false,
            files: [],
            albumBucketName: "printingsystemfiles"
        }
    },
    computed: {
        orderStatuses() {
            let resultArr = this.rawOrderStatuses.map(function(item) {
                return item["name"];
            });

            return resultArr;
        },
        representatives() {
            let resultArr = this.rawRepresentatives.map(function(item) {
                return item["name"];
            });

            return resultArr;
        },
    },
    async mounted() {
        let callPath = "/Order/getOrder?id=" + this.id;
        let orderData = await CallAPI.get(callPath)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
        });

        callPath = "/Representative/getRepresentative?id=" + orderData.idRepresentative;
        let representativeData = await CallAPI.get(callPath)
        .then(res => {
            return res.data;
        })
        .catch(err => {
            CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
        });

        this.idCustomer = representativeData.idCustomer;

        if(this.mode === "read") {
            this.readOnlyMode = true;
        } else if(this.mode === "edit") {
            this.readOnlyMode = false;
        }

        this.updateOrderItemList();
        this.updateAssignmentList();
        this.updateAddressList();
        this.updateFileList();
        await this.getSelectListData();

        this.isAuction = orderData.isAuction;
        this.orderName = orderData.name;
        this.orderIdentifier = orderData.identifier;
        this.orderNote = orderData.note;
        if(orderData.creationDate != null) {
            this.creationDate = new Date(Date.parse(orderData.creationDate));
        } else{
            this.creationDate = null;
        }
        if(orderData.expectedDeliveryDate != null) {
            this.expectedDeliveryDate = new Date(Date.parse(orderData.expectedDeliveryDate));
        } else{
            this.expectedDeliveryDate = null;
        }
        if(orderData.deliveryDate != null) {
            this.deliveryDate = new Date(Date.parse(orderData.deliveryDate));
        } else{
            this.deliveryDate = null;
        }
        if(orderData.offerValidityDate != null) {
            this.offerValidityDate = new Date(Date.parse(orderData.offerValidityDate));
        } else{
            this.offerValidityDate = null;
        }
        if(orderData.submissionDate != null) {
            this.submissionDate = new Date(Date.parse(orderData.orderSubmissionDate));
        } else{
            this.submissionDate = null;
        }
        this.selectedRepresentative = this.getNameById('representative', orderData.idRepresentative);
        this.selectedStatus = this.getNameById('status', orderData.idStatus);
    },
    methods: {
        async submitForm() {
            if(this.validateForm) {
                let callPath = "/Order/updateOrder"
                let body = {
                    IdOrder: this.id,
                    Name: this.orderName,
                    OrderSubmissionDate: this.submissionDate,
                    Note: this.orderNote,
                    IsAuction: this.isAuction,
                    ExpectedDeliveryDate: this.expectedDeliveryDate,
                    DeliveryDate: this.deliveryDate,
                    OfferValidityDate: this.offerValidityDate,
                    IdRepresentative: this.getIdByName("representative", this.selectedRepresentative),
                    IdStatus: this.getIdByName("status", this.selectedStatus),
                };
                
                await CallAPI.post(callPath, body)
                .then(res => {
                    this.$vaToast.init({ message: 'Dane zostały edytowane.', color: 'success', duration: 3000 })
                    return res.data;
                })
                .catch(err => {
                    if(err.message.includes("422")) {
                        this.$vaToast.init({ message: 'Niepoprawne dane formularza.', color: 'danger', duration: 3000 })
                    }else{
                        this.$vaToast.init({ message: 'Błąd edycji danych.', color: 'danger', duration: 3000 })
                    }
                    CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
                });
            }
        },
        validateForm() {
            this.$refs.form.validate();

            if(this.selectedStatus == "") {
                this.isFormValidate = false;
                this.$vaToast.init({ message: 'Zamówienie musi mieć wybrany status.', color: 'danger', duration: 2000 })
            }
            if(this.selectedRepresentative  == "") {
                this.isFormValidate = false;
                this.$vaToast.init({ message: 'Zamówienie musi mieć wybranego reprezentanta.', color: 'danger', duration: 2000 })
            }
            if(this.readOnlyMode){
                this.isFormValidate = false;
            }

            return this.isFormValidate;
        },
        getWorksiteName(assignment) {
            if(assignment.worker.worksite != null) {
                return assignment.worker.worksite.name;
            } else {
                return "Bez stanowiska";
            }
        },
        getNameById(what, id) {
            switch(what) {
                case "status":
                    return this.rawOrderStatuses.find(element => element.idStatus == id).name;
                case "representative":
                    return this.rawRepresentatives.find(element => element.idRepresentative == id).name;
            }
        },
        getIdByName(what, selectedName) {
            switch(what) {
                case "status":
                    return this.rawOrderStatuses.find(element => element.name == selectedName).idStatus;
                case "representative":
                    return this.rawRepresentatives.find(element => element.name == selectedName).idRepresentative;
            }
        },
        async getSelectListData() {
            let callPath = "/OrderStatus/getOrderStatuses";
            this.rawOrderStatuses = await CallAPI.get(callPath)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            callPath = "/Worker/getWorkers";
            this.workers = await CallAPI.get(callPath)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            callPath = "/Representative/getRepresentativesByCustomer?id=" + this.idCustomer;
            this.rawRepresentatives = await CallAPI.get(callPath)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });
        },

        async addAssignment(e) {
            let callPath = "/Assignment/createAssignment";
            let body = {
                IdWorker: e.newWorker.idWorker,
                IdOrder: this.id,
                OrderLeader: e.newWorker.isLeader,
                HoursWorked: e.newWorker.hoursWorker,
            };

            await CallAPI.post(callPath, body)
            .then(res => {
                this.$vaToast.init({ message: 'Pracownik został przypisany.', color: 'success', duration: 3000 })
                return res.data;
            })
            .catch(err => {
                if(err.message.includes("422")) {
                    this.$vaToast.init({ message: 'Niepoprawne dane formularza.', color: 'danger', duration: 3000 })
                }else{
                    this.$vaToast.init({ message: 'Błąd przypisania pracownika.', color: 'danger', duration: 3000 })
                }

                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            this.updateAssignmentList();
        },
        async editAssignment(e) {
            let callPath = "/Assignment/updateAssignment";
            let body = {
                IdWorker: e.newWorker.idWorker,
                IdOrder: this.id,
                OrderLeader: e.newWorker.isLeader,
                HoursWorked: e.newWorker.hoursWorker,
            };

            await CallAPI.post(callPath, body)
            .then(res => {
                this.$vaToast.init({ message: 'Przypisanie zostało edytowane.', color: 'success', duration: 3000 })
                return res.data;
            })
            .catch(err => {
                if(err.message.includes("422")) {
                    this.$vaToast.init({ message: 'Niepoprawne dane formularza.', color: 'danger', duration: 3000 })
                }else{
                    this.$vaToast.init({ message: 'Błąd edycji przypisania.', color: 'danger', duration: 3000 })
                }

                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            this.updateAssignmentList();
        },
        async deleteAssignment() {
            let callPath = "/Assignment/deleteAssignment";
            let body = { data: {
                IdWorker: this.selectedAssignment.idWorker,
                IdOrder: this.id,
            } };

            await CallAPI.delete(callPath, body)
            .then(res => {
                this.$vaToast.init({ message: 'Przypisanie zostało usunięte.', color: 'success', duration: 3000 })
                return res.data;
            })
            .catch(err => {
                if(err.message.includes("422")) {
                    this.$vaToast.init({ message: 'Niepoprawne dane.', color: 'danger', duration: 3000 })
                }else{
                    this.$vaToast.init({ message: 'Błąd usuwania przypisania.', color: 'danger', duration: 3000 })
                }

                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            this.updateAssignmentList();
        },
        async updateAssignmentList() {
            let callPath = "/Assignment/getAssignmentsByOrder?orderId=" + this.id;
            this.assignments = await CallAPI.get(callPath)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });
        },
        openEditAssignment(assignment) {
            this.selectedAssignment = assignment;
            this.showAssignmentsModal = true;
        },
        openDeleteAssignmentModal(assignment) {
            this.selectedAssignment = assignment;
            this.showDeleteAssignmentModal = true;
        },
        closeAssignmentModal() {
            this.selectedAssignment = null;
            this.showAssignmentsModal = false;
        },
        closeDeleteAssignmentModal() {
            this.selectedAssignment = null;
            this.showDeleteAssignmentModal = false;
        },

        async addAddress(e) {
            let callPath = "/DeliveriesAddresses/createDeliveriesAddress";
            let body = {
                IdAddress: e.IdAddress,
                IdOrder: this.id,
                IdSupply: null,
            };

            await CallAPI.post(callPath, body)
            .then(res => {
                this.$vaToast.init({ message: 'Adres został przydzielony.', color: 'success', duration: 3000 })
                return res.data;
            })
            .catch(err => {
                if(err.message.includes("422")) {
                    this.$vaToast.init({ message: 'Niepoprawne dane formularza.', color: 'danger', duration: 3000 })
                }else{
                    this.$vaToast.init({ message: 'Błąd przydzielenia adresu dostawy.', color: 'danger', duration: 3000 })
                }

                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            this.updateAddressList();
        },
        async deleteAddress() {
            let callPath = "/DeliveriesAddresses/deleteDeliveriesAddress";
            let body = { data: {
                IdDeliveriesAddresses: this.selectedAddress.idDeliveriesAddresses
            } };

            await CallAPI.delete(callPath, body)
            .then(res => {
                this.$vaToast.init({ message: 'Przydzielenie zostało usunięte.', color: 'success', duration: 3000 })
                return res.data;
            })
            .catch(err => {
                if(err.message.includes("422")) {
                    this.$vaToast.init({ message: 'Niepoprawne dane.', color: 'danger', duration: 3000 })
                }else{
                    this.$vaToast.init({ message: 'Błąd usuwania przydzielenia adresu.', color: 'danger', duration: 3000 })
                }

                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            this.updateAddressList();
        },
        async updateAddressList() {
            let callPath = "/DeliveriesAddresses/getDeliveriesAddressesByOrder?id=" + this.id;
            this.addresses = await CallAPI.get(callPath)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });
        },
        openDeleteAddressModal(address) {
            this.selectedAddress = address;
            this.showDeleteAddressModal = true;
        },
        closeAddressModal() {
            this.showAddressesModal = false;
            this.selectedAddress = null;
        },
        closeDeleteAddressModal() {
            this.showDeleteAddressModal = false;
            this.selectedAddress = null;
        },


        async addOrderItem(e) {
            let callPath = "/OrderItem/createOrderItem";
            let body = {
                IdOrder: this.id,
                Circulation: e.newOrderItem.circulation,
                Capacity: e.newOrderItem.capacity,
                Name: e.newOrderItem.name,
                Comments: e.newOrderItem.comments,
                ExpectedCompletionDate: e.newOrderItem.expectedCompletionDate,
                CompletionDate: e.newOrderItem.completionDate,
                InsideFormat: e.newOrderItem.insideFormat,
                CoverFormat: e.newOrderItem.coverFormat,
                IdDeliveryType: e.newOrderItem.selectedDeliveryType,
                IdBindingType: e.newOrderItem.selectedBindingTypes,
                IdOrderItemType: e.newOrderItem.selectedOrderItemType,
                Colors: e.newOrderItem.colors,
                Services: e.newOrderItem.services,
                Papers: e.newOrderItem.papers,
            };

            await CallAPI.post(callPath, body)
            .then(res => {
                this.$vaToast.init({ message: 'Przedmiot zamówienia został dodany.', color: 'success', duration: 3000 })
                return res.data;
            })
            .catch(err => {
                if(err.message.includes("422")) {
                    this.$vaToast.init({ message: 'Niepoprawne dane.', color: 'danger', duration: 3000 })
                }else{
                    this.$vaToast.init({ message: 'Błąd dodawania przedmiotu zamówienia.', color: 'danger', duration: 3000 })
                }

                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            this.updateOrderItemList();
        },
        async editOrderItem(e) {
            let callPath = "/OrderItem/updateOrderItem";
            let body = {
                IdOrderItem: e.newOrderItem.idOrderItem,
                Circulation: e.newOrderItem.circulation,
                Capacity: e.newOrderItem.capacity,
                Name: e.newOrderItem.name,
                Comments: e.newOrderItem.comments,
                ExpectedCompletionDate: e.newOrderItem.expectedCompletionDate,
                CompletionDate: e.newOrderItem.completionDate,
                InsideFormat: e.newOrderItem.insideFormat,
                CoverFormat: e.newOrderItem.coverFormat,
                IdDeliveryType: e.newOrderItem.selectedDeliveryType,
                IdBindingType: e.newOrderItem.selectedBindingTypes,
                IdOrderItemType: e.newOrderItem.selectedOrderItemType,
                Colors: e.newOrderItem.colors,
                Services: e.newOrderItem.services,
                Papers: e.newOrderItem.papers,
            };

            await CallAPI.post(callPath, body)
            .then(res => {
                this.$vaToast.init({ message: 'Przedmiot zamówienia został edytowany.', color: 'success', duration: 3000 })
                return res.data;
            })
            .catch(err => {
                if(err.message.includes("422")) {
                    this.$vaToast.init({ message: 'Niepoprawne dane.', color: 'danger', duration: 3000 })
                }else{
                    this.$vaToast.init({ message: 'Błąd edycji przedmiotu zamówienia.', color: 'danger', duration: 3000 })
                }

                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            this.updateOrderItemList();
        },
        async deleteOrderItem() {
            let callPath = "/OrderItem/deleteOrderItem";
            let body = { data: {
                IdOrderItem: this.selectedOrderItem.idOrderItem
            } };

            await CallAPI.delete(callPath, body)
            .then(res => {
                this.$vaToast.init({ message: 'Przedmiot zamówienia został usunięty.', color: 'success', duration: 3000 })
                return res.data;
            })
            .catch(err => {
                if(err.message.includes("422")) {
                    this.$vaToast.init({ message: 'Niepoprawne dane.', color: 'danger', duration: 3000 })
                }else{
                    this.$vaToast.init({ message: 'Błąd usuwania przedmiotu zamówienia.', color: 'danger', duration: 3000 })
                }

                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            this.updateOrderItemList();
        },
        async updateOrderItemList() {
            let callPath = "/OrderItem/getOrderItemsByOrder?id=" + this.id;
            this.orderItems = await CallAPI.get(callPath)
            .then(res => {
                return res.data;
            })
            .catch(err => {
                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });
        },
        openEditOrderItem(item) {
            this.selectedOrderItem = item;
            this.showOrderItemModal = true;
        },
        openDeleteOrderItemModal(item) {
            this.selectedOrderItem = item;
            this.showDeleteOrderItemModal = true;
        },
        closeEditOrderItem() {
            this.selectedOrderItem = null;
            this.showOrderItemModal = false;
        },
        closeDeleteOrderItemModal() {
            this.selectedOrderItem = null;
            this.showDeleteOrderItemModal = false;
        },

        async addFile(e) {
            let callPath = "/File/createFile";
            let body = {
                Name: e.newFile.name,
                IdFileType: e.newFile.fileType,
                IdFileStatus: e.newFile.fileStatus,
                IdValuation: null,
                IdOrderItem: null,
                IdOrder: this.id,
            };

            await CallAPI.post(callPath, body)
            .then(res => {
                this.$vaToast.init({ message: 'Plik został dodany.', color: 'success', duration: 3000 })
                return res.data;
            })
            .catch(err => {
                if(err.message.includes("422")) {
                    this.$vaToast.init({ message: 'Niepoprawne dane.', color: 'danger', duration: 3000 })
                }else{
                    this.$vaToast.init({ message: 'Błąd dodawania pliku.', color: 'danger', duration: 3000 })
                }

                CallSeq.post('', {"Events":[{"Timestamp": new Date().toISOString(), "MessageTemplate": err.message, "Properties": { error: err }}]})
            });

            this.updateFileList();
        },
        async updateFileList() {
            // setup data
            const REGION = "eu-west-2";
            const secretAccessKey = "ESrtU64dJv7DWCFdvKZ0kSokRNfnV5LbdRDbVN/h"
            const accessKeyId = "AKIAQC42EGU5WCMUZBHR"

            // create s3 object
            const awsClient = new S3Client({
                region: REGION,
                credentials: {
                    accessKeyId: accessKeyId,
                    secretAccessKey: secretAccessKey
                }
            });

            // create params and command
            const params = { Bucket: this.albumBucketName };
            const command = new ListObjectsCommand(params);

            // send command and handle it correctly
            try{
                var resultData = await awsClient.send(command);
                this.files = resultData.Contents;
            }catch(err) {
                console.log("Error appeared");
                console.log(err);
            }
        },
        async deleteFile(file) {
            // setup data
            const REGION = "eu-west-2";
            const secretAccessKey = "ESrtU64dJv7DWCFdvKZ0kSokRNfnV5LbdRDbVN/h"
            const accessKeyId = "AKIAQC42EGU5WCMUZBHR"

            // create s3 object
            const awsClient = new S3Client({
                region: REGION,
                credentials: {
                    accessKeyId: accessKeyId,
                    secretAccessKey: secretAccessKey
                }
            });

            // create params and command
            const params = { Bucket: this.albumBucketName, Delete: { Objects: [ { Key: file.Key } ] }, Quiet: true };
            const command = new DeleteObjectsCommand(params);

            // send command and handle it correctly
            try{
                await awsClient.send(command);
            }catch(err) {
                console.log("Error appeared");
                console.log(err);
            }

            this.updateFileList();
        },  
        closeFileModal(){
            this.showFileModal = false;
        },
        removeExtension(filename) {
            return filename.substring(0, filename.lastIndexOf('.')) || filename;
        },
    }
}
</script>

<style scoped>
#background {
    display: grid;
    grid-template-columns: 50px 1fr 1fr 50px;
    grid-template-rows: auto;
    grid-template-areas: 
    ". header header ."
    ". main sidebarA ."
    ". main sidebarB ."
    ". sidebarC sidebarC ."
    ". sidebarD sidebarD .";
    grid-gap: 30px;
}

#headerCo {
    grid-area: header;
    padding: 20px;
    background: white;
	border-radius: 25px;
}

#orderDetailsCo {
    grid-area: main;
}

#orderDetailsCoInner {
    padding: 20px;
    background: white;
	border-radius: 25px;
}

#orderItemsCo {
    grid-area: sidebarC;
}

#orderItemsCoInner {
    padding: 20px;
    background: white;
	border-radius: 25px;
}

#filesCo {
    grid-area: sidebarD;
}

#filesCoInner {
    padding: 20px;
    background: white;
	border-radius: 25px;
}

#workersCo {
    grid-area: sidebarA;
}

#workersCoInner {
    padding: 20px;
    background: white;
	border-radius: 25px;
}

#addressesCo {
    grid-area: sidebarB;
}

#addressesCoInner {
    padding: 20px;
    background: white;
	border-radius: 25px;
}

#isAuctionCo {
    display: inline;
}

#isAuctionCo i {
    margin: 10px;
}

#form {
    display: flex;
    flex-direction: column;
}

.inputWidth {
    margin: 10px;
    width: 300px;
    align-self: center;
}

#editButton{
    width: 150px;
    align-self: center;
}




#deleteFile {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 99999;
    border-radius: 25px;
}

#deleteFile:hover {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 99999;
    border: solid 1px red;
}

.file-container-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.file-container {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 10px;
    margin-top: 10px;
}

.file-item {
    display: flex;
	flex-direction: column;
	align-items: center;
    justify-content: center;
    min-width: 100px;
    min-height: 100px;
    border-radius: 15px;
    margin: 10px;
    position: relative;
    border: lightgray 1px solid;
    box-shadow: 1px 1px lightgray;
}

.file-item:hover {
    box-shadow: 10px 10px 5px lightblue;
}

.file-icons {
    display: block;
    margin-bottom: 10px;
}
</style>