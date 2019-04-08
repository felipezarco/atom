<!DOCTYPE html>
<html lang="en">
<head>
	<?php include('includes/header.php');?>
	<link href="assets/plugins/ion-rangeslider/ion.rangeSlider.css" rel="stylesheet" type="text/css">
	<link href="assets/plugins/ion-rangeslider/ion.rangeSlider.skinFlat.css" rel="stylesheet" type="text/css">
	<link href="assets/plugins/dropzone/dist/dropzone.css" rel="stylesheet" type="text/css">
	<link href="assets/plugins/dropify/css/dropify.min.css" rel="stylesheet">
	<link href="assets/css/csspa.css" rel="stylesheet">

	<!-- <link href="assets/css/bootstrap.min.css" rel="stylesheet" type="text/css"> -->
	<!-- <link href="assets/css/icons.css" rel="stylesheet" type="text/css"> -->
	<!-- <link href="assets/css/style.css" rel="stylesheet" type="text/css"> -->

</head>
	<div class="topbar">
		<div class="topbar-main">
			<div class="container-fluid">
			<!-- LOGO -->
				<div class="topbar-left">
					<a href="admin.php" class="logo">
						<span>
						<img src="assets/images/logo-sm.png" alt="logo-small" class="logo-sm">
						</span>
						<span>
						<img src="assets/images/logo.png" alt="logo-large" class="logo-lg">
						</span>
					</a>
				</div>
				<!-- Navbar -->
				<nav class="navbar-custom">
					<ul class="list-unstyled topbar-nav float-right mb-0">
						<!--<li class="hidden-sm">
							<a class="nav-link dropdown-toggle waves-effect waves-light" data-toggle="dropdown" href="javascript: void(0);" role="button" aria-haspopup="false" aria-expanded="false">Português <img src="assets/images/flags/br_flag.jpg" class="ml-2" height="16" alt=""> <i class="mdi mdi-chevron-down"></i></a>
							<div class="dropdown-menu dropdown-menu-right">
								<a class="dropdown-item" href="javascript: void(0);">
									<span>German </span>
									<img src="assets/images/flags/germany_flag.jpg" alt="" class="ml-2 float-right" height="14">
								</a>
								<a class="dropdown-item" href="javascript: void(0);">
									<span>Italian </span>
									<img src="assets/images/flags/italy_flag.jpg" alt="" class="ml-2 float-right" height="14">
								</a>
								<a class="dropdown-item" href="javascript: void(0);">
									<span>French </span>
									<img src="assets/images/flags/french_flag.jpg" alt="" class="ml-2 float-right" height="14">
								</a>
								<a class="dropdown-item" href="javascript: void(0);">
									<span>Spanish </span>
									<img src="assets/images/flags/spain_flag.jpg" alt="" class="ml-2 float-right" height="14">
								</a>
								<a class="dropdown-item" href="javascript: void(0);">
									<span>Russian </span>
									<img src="assets/images/flags/russia_flag.jpg" alt="" class="ml-2 float-right" height="14">
								</a>
							</div>
						</li>-->
						<li class="dropdown">
							<a class="nav-link dropdown-toggle arrow-none waves-light waves-effect" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
								<i class="mdi mdi-bell-outline nav-icon"></i>
								<span class="badge badge-danger badge-pill noti-icon-badge">1</span>
							</a>
							<div class="dropdown-menu dropdown-menu-right dropdown-lg">
								<!-- item-->
								<h6 class="dropdown-item-text">Notificações</h6>
								<div class="slimscroll notification-list">
									<!-- item-->
									<a href="javascript:void(0);" class="dropdown-item notify-item active">
										<div class="notify-icon bg-success"><i class="mdi mdi-account-check"></i></div>
										<p class="notify-details">
											Campanha
											<small class="text-muted">
											Campanha Teste Importada com Sucesso
											</small>
										</p>
									</a>
									<!-- item-->
								</div>
								<!-- All-->
								<a href="javascript:void(0);" class="dropdown-item text-center text-primary">Ver Todas <i class="fi-arrow-right"></i></a>
							</div>
						</li>
						<li class="hidden-sm">
							<a class="nav-link waves-effect waves-light" href="javascript:void(0);" id="btn-fullscreen">
								<i class="mdi mdi-fullscreen nav-icon"></i>
							</a>
						</li>
						<li class="dropdown">
							<a class="nav-link dropdown-toggle waves-effect waves-light nav-user" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false">
								<img src="images/foto/<?php echo $foto?>" alt="profile-user" class="rounded-circle">
								<span class="ml-1 nav-user-name hidden-sm" style="color:#FFFFFF"><?php echo $nomeop ?> <i class="mdi mdi-chevron-down"></i></span>
							</a>
							<div class="dropdown-menu dropdown-menu-right">
								<a class="dropdown-item" href="#"><i class="dripicons-user text-muted mr-2"></i> Perfil</a>
								<a class="dropdown-item" href="#"><i class="dripicons-gear text-muted mr-2"></i> Configuraçãoes</a>
								<a class="dropdown-item" href="#"><i class="dripicons-lock text-muted mr-2"></i> Bloquear Tela</a>
								<div class="dropdown-divider"></div>
								<a class="dropdown-item" href="Sair"><i class="dripicons-exit text-muted mr-2"></i> Sair</a>
							</div>
						</li>
						<li class="menu-item">
							<!-- Mobile menu toggle-->
							<a class="navbar-toggle nav-link" id="mobileToggle">
								<div class="lines"><span></span> <span></span> <span></span></div>
							</a>
							<!-- End mobile menu toggle-->
						</li>
					</ul>
					<ul class="list-unstyled topbar-nav mb-0">
						<li class="hidden-sm"><a class="nav-link dropdown-toggle waves-effect waves-light nav-user" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false"><i class=" fa fa-microphone"></i> <span id="status_switch_text">OFF</span> <i class="mdi mdi-chevron-down" style="display: unset"></i></a>
							<div class="dropdown-menu" id="pausa_menu" style="visibility: visible" >
								<?php
								 $sqlpausa = mysql_query("SELECT * FROM PAUSA_CAD WHERE AGENCIA ='$idagencia' AND P_ATIVO='1'")or die(mysql_error());
								 while($pausa = mysql_fetch_array($sqlpausa))
								 {
									 $pausaid = $pausa['P_ID'];
									 $pausadesc = $pausa['P_DESC'];
									 echo '	<!-- item--><a href="javascript:void(0);" class="dropdown-item set_on" data-tipo_pausa="'.$pausaid.'">'.$pausadesc.'</a>';
								 }
								?>

							</div>
						</li>
						<li class="hidden-sm"><a class="nav-link dropdown-toggle waves-effect waves-light nav-user" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false"><i class="mdi mdi-library-plus mr-2"></i>Campanha <i class="mdi mdi-chevron-down"></i></a>
							<div class="dropdown-menu">
							<?php
							$lista = mysql_query("SELECT * FROM CAMPANHA_CLIENTE WHERE AGENCIA = '$idagencia' AND STATUS ='0' ")or die (mysql_error());
							while($campanha =  mysql_fetch_array($lista))
							{
								$campanhaid 	= $campanha['ID'];
								$campanhadesc	= $campanha['NOME'];
								echo '<!-- item--><a href="javascript:void(0);" class="dropdown-item">'.$campanhadesc.'</a>';

							}
							?>
							</div>
						</li>
						<li class="hidden-sm"><a class="nav-link dropdown-toggle waves-effect waves-light nav-user" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false"><i class="mdi mdi-chart-pie"></i> Meta <i class="mdi mdi-chevron-down"></i></a>
							<div class="dropdown-menu">
								<!-- item--><a href="javascript:void(0);" class="dropdown-item">Diária R$ 20.000,00</a>
								<!-- item--><a href="javascript:void(0);" class="dropdown-item">Mensal R$ 100.000,00 </a>
							</div>
						</li>
						<li class="hidden-sm"><a class="nav-link dropdown-toggle waves-effect waves-light nav-user" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false"><i class=" mdi mdi-shopping"></i> Venda <i class="mdi mdi-chevron-down"></i></a>
							<div class="dropdown-menu">
								<!-- item--><a href="javascript:void(0);" class="dropdown-item"><strong>10 </strong>Pré-Venda</a>
								<!-- item--><a href="javascript:void(0);" class="dropdown-item"><strong>50 </strong>Propostas</a>
							</div>
						</li>
						<li class="hidden-sm">
						<a class="nav-link dropdown-toggle waves-effect waves-light nav-user" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false"><i class="fa fa-phone "></i> Ligações <i class="mdi mdi-chevron-down"></i></a>
							<div class="dropdown-menu">
								<!-- item--><a href="javascript:void(0);" class="dropdown-item"><strong>300 </strong>Atendidas</a>
								<!-- item--><a href="javascript:void(0);" class="dropdown-item"><strong>150 </strong>Agendada</a>
								<!-- item--><a href="javascript:void(0);" class="dropdown-item"><strong>50 </strong>Inválida</a>
							</div>
						</li>
						<li class="hidden-sm">
						<a class="nav-link dropdown-toggle waves-effect waves-light nav-user" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false"><i class="mdi mdi-calendar-clock"></i> Agenda </a>

						</li>

					</ul>
				</nav>
			<!-- end navbar-->
			</div>
		</div>
		<!-- MENU Start -->
	  <div class="navbar-custom-menu" id="dados_cliente" style="display:none;">
			<div class="container-fluid">
					<div id="navigation">
						<div class="table-responsive">
							<table class="table mb-0" style="min-width: 600px;margin: 0 auto;max-width: 1010px;" >
								<thead>
									<tr></tr>
								</thead>
								<tbody>
								<tr>
									<td style="padding:5px; text-align: center;" class="tabledit-view-mode "><h5 id="nome-campanha" style="color: #007bff;"></h5></td>
									<td style="padding:5px; text-align: center;"	class="tabledit-view-mode "><a href="#" data-toggle="modal" data-animation="bounce" data-target=".cliente" id="cliNome"></a></td>
									<td style="padding:5px; text-align: center;" class="tabledit-view-mode" ><a href="#" data-toggle="modal" data-animation="bounce" data-target=".matricula" id="cliMatricula"></a></td>
								  <td style="padding:5px; text-align: right;" class="tabledit-view-mode" id="td-telativo">
									</td>
									<td style="text-align: right;">
										<ul class="list-unstyled topbar-nav mb-0" id="tabulacao">
											<li class="hidden-sm">
												<button  style=" font-size: 12px;" class=" btn btn-soft-success nav-link dropdown-toggle waves-effect waves-light nav-user tdbutton" data-toggle="dropdown" href="#" role="button" aria-haspopup="false" aria-expanded="false"><i class=" mdi mdi-alarm"></i> Tabular</button>
												<div class="dropdown-menu">
												<?php
												$sqltab =  mysql_query("SELECT * FROM TABULACAO_CAD WHERE AGENCIA ='$idagencia' AND TAB_CAD_ATIVO='1'")or die(mysql_error());
												while($tab = mysql_fetch_array($sqltab))
												{
													$tabid = $tab['TAB_CAD_ID'];
													$tabdesc = $tab['TAB_CAD_DESC'];

													echo '<!-- item--><a href="javascript:void(0);" class="botao_tabular dropdown-item" id="tabulacao" data-id_tabulacao="'.$tabid.'">'.$tabdesc.'</a>';
												}

												?>
												</div>
											</li>
										</ul>
									</td>
									<td style="padding:5px" class="tabledit-view-mode ">
										<button  style=" font-size: 12px;" class=" btn btn-soft-info nav-link dropdown-toggle waves-effect waves-light nav-user tdbutton" data-toggle="modal" data-animation="bounce" data-target=".agendar" role="button" aria-haspopup="false" aria-expanded="false"><i class=" mdi mdi-calendar-clock"></i> Agendar</button>
									</td>
									<!-- <td  style="padding:5px"class="tabledit-view-mode ">
										<button  style=" font-size: 12px; width:110px" class=" btn btn-soft-purple nav-link dropdown-toggle waves-effect waves-light nav-user tdbutton" data-toggle="modal" data-animation="bounce" data-target=".documento" role="button" aria-haspopup="false" aria-expanded="false"><i class=" mdi mdi-file-document-box"></i> Documentos</button>
									</td> -->
								</tr>
								</tbody>
							</table>
						</div>
				</div>
			<!-- end navigation -->
			</div>
			<!-- end container-fluid -->
		</div>

		<!-- end navbar-custom -->
	</div>
	<!-- Top Bar End  style="display:none;" id="myDiv" class="animate-bottom" -->
<div class="wrapper">
	<div class="container-fluid">
		<div id="form-proposta" style="display: none;">
			<div class="row">
				<div class="col-sm-12">
					<div class="page-title-box">
					</div>
				</div>
			</div>
			<form id="cadastro-proposta"  method="post" enctype="multipart/form-data">
			<div class="col-md-12 col-lg-12">
				<div class="card">
					<div class="card-body">
					<h5 class="mt-0">Dados do Cliente</h5>

						<div class="form-group row">
							<div class="col-sm-12 col-lg-3">
							 <label for="cpf" class="col-form-label">CPF</label>
							<input class="form-control" type="text" id="cpf" placeholder="CPF" value="">
						</div>

						<div class="col-sm-12 col-lg-6 mo-b-15">
								<label for="cpf" class="col-form-label">Nome</label>
							<input class="form-control" type="text" id="nome" placeholder="Nome"  value="">
						</div>

						<div class="col-sm-12 col-lg-3">
								<label for="cpf" class="col-form-label">Data Nasc</label>
							<input class="form-control" type="text" id="data_nasc" placeholder="Data de Nascimento"  value="">
						</div>
						</div>

						 <div class="form-group row">
							<div class="col-sm-12 col-lg-3">
								<label for="cpf" class="col-form-label">Naturalidade</label>
								<input class="form-control" type="text" id="naturalidade" name="naturalidade" placeholder="Naturalidade">
							</div>
							<div class="col-sm-12 col-lg-2">
								<label for="cpf" class="col-form-label">Genero</label>
								<input class="form-control" type="text" id="sexo" placeholder="Sexo" value="">
							</div>
							<div class="col-sm-12 col-lg-2">
								<label for="cpf" class="col-form-label">Estado Civil</label>
								<input class="form-control" type="text" id="estado-civil" name ="estado-civil" placeholder="Estado Civil">
							</div>
							<div class="col-sm-12 col-lg-2">
								<label for="cpf" class="col-form-label">Tipo de Documento</label>
								<select class="select2 form-control mb-3 custom-select" id="tipodoc" name="tipodoc" style="width: 100%; height:36px;">
								<option value="0">Selecione</option>
								<option value="rg">RG</option>
								<option value="cnh">CNH</option>
							 </select>
							</div>
							<div class="col-sm-12 col-lg-3">
										<label for="cpf" class="col-form-label">Nº do documento</label>
								<input class="form-control" type="text" id="numerodoc" name ="numerodoc" placeholder="Nº Documento">
							</div>
						</div>
						<div class="form-group row">
						<div class="col-sm-12 col-lg-2">
								 <label for="cpf" class="col-form-label">Orgão Emissor</label>
							<input class="form-control" type="text" id="emissor" name="emissor" placeholder="Orgão Emissor">
						</div>
						<div class="col-sm-12 col-lg-2">
								 <label for="cpf" class="col-form-label">Emissor/UF</label>
							<input class="form-control" type="text" id="ufemissor"  name ="ufemissor" placeholder="Emissor UF">
						</div>
						<div class="col-sm-12 col-lg-4">
								 <label for="cpf" class="col-form-label">Nome da Mãe</label>
							<input class="form-control" type="text" id="mae" name ="mae" placeholder="Nome da Mãe">
						</div>
						<div class="col-sm-12 col-lg-4">
										 <label for="cpf" class="col-form-label">Nome do Pai</label>
							<input class="form-control" type="text" id="pai" name="pai" placeholder="Nome do Pai">
						</div>
						<div class="col-sm-12 col-lg-3">
								<label for="cpf" class="col-form-label">Telefone</label>
								<select class="select2 form-control mb-3 custom-select" id="telefone" name="telefone" style="width: 100%; height:36px;">
								<option value="0">Selecione um Telefone valido</option>
							 </select>
						</div>
						<div class="col-sm-12 col-lg-3">
								<label for="cpf" class="col-form-label">Email</label>
								<select class="select2 form-control mb-3 custom-select" id="email" name="email" style="width: 100%; height:36px;">
								<option value="0">Selecione um E-mail valido</option>
							 </select>
						</div>
						<div class="col-sm-12 col-lg-6">
								<label for="cpf" class="col-form-label">Endereço</label>
								<select class="select2 form-control mb-3 custom-select" id="idend" name="idend" style="width: 100%; height:36px;">
								<option value="0">Selecione um Endereço valido</option>
							 </select>
						</div>

						<div class="col-sm-12 col-lg-2">
								<label for="cpf" class="col-form-label">Tempo de Res. (anos)</label>
							<input class="form-control" type="text" id="temporesidencia" name="temporesidencia" placeholder="Tempo">
						</div>
						</div>
					</div>
				</div>
				</div>
			<div class="col-md-12 col-lg-12">
				<div class="card">
					<div class="card-body">
					<h5 class="mt-0">Dados da Proposta</h5>
						<div class="form-group row">
						<div class="col-sm-12 col-lg-2 mo-b-15">
							 <label for="cpf" class="col-form-label">NB</label>
							<input class="form-control" type="text" id="idnb" placeholder="NB" name="idnb" value="">
						</div>
						<div class="col-sm-12 col-lg-1">
							<label for="cpf" class="col-form-label">Especie</label>
							<input class="form-control" type="text" id="especie" placeholder="Espécie" value="">
						</div>
						<div class="col-sm-12 col-lg-1">
								<label for="cpf" class="col-form-label">Cod </label>
							<input class="form-control" type="text" id="codbanco" placeholder="Cod" value="">
						</div>
						<div class="col-sm-12 col-lg-3">
								<label for="cpf" class="col-form-label">Banco</label>
							<input class="form-control"type="text" id="banco" placeholder="Banco" value="">
						</div>
						<div class="col-sm-12 col-lg-1">
								<label for="cpf" class="col-form-label">Agência</label>
							<input class="form-control" type="text" id="agencia" placeholder="Agência" value="">
						</div>
						<div class="col-sm-12 col-lg-1">
								<label for="cpf" class="col-form-label">Conta</label>
							<input class="form-control" type="text" id="conta" placeholder="Conta" value="">
						</div>
						<div class="col-sm-12 col-lg-2">
								<label for="cpf" class="col-form-label">Salário (R$)</label>
							<input class="form-control" type="text" id="salario" placeholder="Salário" value="">
						</div>
						<div class="col-sm-12 col-lg-2">
								<label for="cpf" class="col-form-label">Tipo</label>
							<input class="form-control" type="text" id="" placeholder="Produto" value="">
						</div>
						<div class="col-sm-12 col-lg-2">
								<label for="cpf" class="col-form-label">Margem</label>
							<input class="form-control" type="text" id="" placeholder="Produto" value="">
						</div>
						<div class="col-sm-12 col-lg-2">
								<label for="cpf" class="col-form-label">Banco para Proposta</label>
							<input class="form-control" type="text" id="" placeholder="Produto" value="">
						</div>
						<div class="col-sm-12 col-lg-2">
								<label for="cpf" class="col-form-label">Parcelas</label>
							<input class="form-control" type="text" id="" placeholder="Valor Proposta" value="">
						</div>
						<div class="col-sm-12 col-lg-2">
								<label for="cpf" class="col-form-label">Valor Proposta</label>
							<input class="form-control"  type="text" id="" placeholder="Parcelas" value="">
						</div>
						<?php
						if($tipoprod == 4)
						{
						?>
						<div class="col-sm-12 col-lg-2">
								<label for="cpf" class="col-form-label">Tipo</label>
							<input class="form-control" type="text" id="" placeholder="Produto" value="">
						</div>
						<div class="col-sm-12 col-lg-2">
								<label for="cpf" class="col-form-label">Margem</label>
							<input class="form-control" type="text" id="" placeholder="Produto" name="margem" value="">
						</div>
						<div class="col-sm-12 col-lg-2">
								<label for="cpf" class="col-form-label">Banco para Proposta</label>
							<input class="form-control" type="text" id="" placeholder="Produto" name="bancoproposta" value="">
						</div>
						<div class="col-sm-12 col-lg-2">
								<label for="cpf" class="col-form-label">Valor Proposta</label>
							<input class="form-control" type="text" id="" placeholder="Parcelas" name="valor_proposta" value="">
							<!-- number_format( $valorproposta, 2, ',', '.') -->
						</div>
					<?php } ?>
						<?php
						if($tipoprod == 5)
						{
						?>
						<div class="col-sm-12 col-lg-2">
								<label for="cpf" class="col-form-label">Tipo</label>
							<input class="form-control" type="text" id="" placeholder="Produto" name="produto" value="">
						</div>
						<div class="col-sm-12 col-lg-2">
								<label for="cpf" class="col-form-label">Valor da Parcela</label>
							<input class="form-control" type="text" id="" placeholder="Valor Parcela"  name="vlr_parcelas" value="">
						</div>
						<div class="col-sm-12 col-lg-2">
								<label for="cpf" class="col-form-label">Saldo Devedor</label>
							<input class="form-control" type="text" id="" placeholder="Produto" name="saldo_dev" value="">
						</div>
						<div class="col-sm-12 col-lg-2">
								<label for="cpf" class="col-form-label">Parcelas Restantes</label>
							<input class="form-control" type="text" id="" placeholder="Produto" name="parc_restante" value="">
						</div>
						<div class="col-sm-12 col-lg-2">
								<label for="cpf" class="col-form-label">Valor Troco</label>
							<input class="form-control" 	type="text" id="" placeholder="Produto" name="troco" value="">
						</div>
					<?php } ?>


						</div>
					</div>
				</div>
				<div class="card">
					<div class="card-body">
					<h5 class="mt-0">Liberação do Crédito</h5>
						<div class="form-group row">
						<div class="col-sm-12 col-lg-3 mo-b-15">
							 <label for="cpf" class="col-form-label">Banco</label>
							<select class="select2 form-control mb-3 custom-select" id="bancoliberacao" name="bancoliberacao" style="width: 100%; height:36px;">
							<optgroup label="COD - BANCO">
								<?php
								if($prop_banco =='')
								{
									echo '<option value="0">Selecione</option>';
								}
								if(!!$prop_banco)
								{
									$sqlbanco = mysql_query("SELECT * FROM BANCOS WHERE ID ='$prop_banco'")or die(mysql_error());
								}
								else
								{
									$sqlbanco = mysql_query("SELECT * FROM BANCOS ")or die(mysql_error());
								}
								while($listBanco = mysql_fetch_array($sqlbanco))
								{
									$id_banco 	= $listBanco['ID'];
									$cod 	 	= $listBanco['COD'];
									$banco		= $listBanco['BANCO'];
									if(!!$prop_banco)
									{
										echo '<option value="<?php echo $id_banco ?>">'.$cod.' - '.$banco.'</option>';
									}
									else
									{
										echo '<option value="<?php echo $id_banco ?>">'.$cod.' - '.$banco.'</option>';
									}
								?>
								<?php } ?>
							</optgroup>
							</select>
						</div>
						<div class="col-sm-12 col-lg-2">
								<label for="cpf" class="col-form-label">Agência</label>
							<input class="form-control" type="text" id="example-email-input3" name="agencialiberacao" placeholder="Agencia" value="<?php echo $agencia_libera ?>">
						</div>
						<div class="col-sm-12 col-lg-2">
								<label for="cpf" class="col-form-label">Conta</label>
							<input class="form-control" type="text" id="example-email-input3" name="contaliberacao" placeholder="Conta" value="<?php echo $conta_libera ?>">
						</div>
						<div class="col-sm-12 col-lg-2">
								<label for="cpf" class="col-form-label">Tipo de Conta</label>
							<select class="select2 form-control mb-3 custom-select" name="tipocontaliberacao" style="width: 100%; height:36px;">
							<?php echo $tipoconta_libera ?>
							<option value="0">Selecione</option>
							<option value="corrente">Conta Corrente</option>
							<option value="poupanca">Conta Poupança</option>
							</select>
						</div>
						</div>
						<div id="res_server" style="margin-top: 10px"></div>
							<button type="submit" class="btn btn-primary px-4">Cadastrar Proposta</button>
							<button id="btn-voltar" class="btn btn-secondary px-4">Voltar</button>
						</div>
				</div>
				</div>
		</form>
		</div>

		<div id="waiting_for_call" style="display: block;">
					<i class="loading_icon"></i>
					<span>Aguardando chamada...</span>
			</div>


			<div id="set_on" style="display:none;">
				<i class="mdi mdi-pause-octagon-outline"></i>
				<span>
					<div id="retornopausa" style=" margin-bottom: -26px;"></div><br/>
					<p class="set_on">
						Continuar <i class="mdi mdi-play"></i>
					</p>
				</span>
			</div>

		<div id="inspecting_call" style="display:none;">

			<!-- Chamada atendida -->
				<!-- dados cliente -->
				<div class="row">
					<div class="col-md-4" id="novo_card" style="display: block;">
						<div class="card">
							<div class="card-body">
							<div class="row">
								<div style="margin-left: 31px;">

									<input class="knob" onClick="this.select();" id="novo_margem" data-width="110" data-height="110" data-min="0" data-displayprevious="true" data-max="" data-step="1" data-fgcolor="#5fb7e0" data-thickness=".1">

								</div>
								<div class="col-md-6">
									<div class="p-3" >
										<table id="datatable" class=" table-bordered" style="width: 157%; height: 65px;">
											<select class="form-control" name="prazo_novo" id="prazo_novo" style="margin-bottom: 10px; width: 67px;">

											</select>

										  	<thead>
											  <tr id="tab_novo_head"></tr>
										   </thead>
										  <tbody>
											  <tr id="tab_novo_td"></tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
								<span class="text-muted">Novo</span>
							</div>
						</div>


				</div><!-- end row -->
				<div class="col-md-3" id="cartao_card" style="display: block;"> <!-- cartao -->
						<div class="card">
							<div class="card-body">
							<div class="row" style="margin-bottom: 29px;">
								<div style="margin-left: 31px;">
									<input class="knob" onClick="this.select();" id="cartao_margem" data-width="110" data-height="110"  data-displayprevious="true"  data-step="1" data-fgcolor="#5fb7e0" data-thickness=".1">
								</div>
								<div class="col-md-6">
									<div class="p-3" id="table-cartao">

									</div>
								</div>
							</div>
								<span class="text-muted">Cartão</span>
							</div>
						</div>
				</div>
				<div class="col-md-3" id="saque_complementar_card" style="display: none;">
					<div class="card">
						<div class="card-body">
							<div class="row" style="margin-bottom: -2px;">
								<div style="margin-left: 31px;">
								<input class="knob" onClick="this.select();" id="saque_margem" data-width="110" data-height="110" data-min="0" data-displayprevious="true"  data-step="1"  data-fgcolor="#5fb7e0" data-thickness=".1">
								</div>
								<div class="col-md-8">
									<div class="p-3" >
										<div class="table-responsive">
											<table id="datatable" class=" table-bordered" >
												<thead>
												 <tr id="tab_saque_head"></tr>
												</thead>
												<tbody>
													<tr>
													 <tr id="tab_saque_td"></tr>
													</tr>
												</tbody>
											</table>
										</div>
									</div>
								</div>
							</div>
							<span class="text-muted">Saque Complementar</span>
						</div>
					</div>
				</div>
			</div>
			<div class="row">
				<div class="col-md-10 col-xl-10" id="portabilidade_card" style="display: none;">
					<div class="card">
						<div class="card-body">
							<div class="row">
								<div style="margin-left: 31px;">
									<input class="knob" onClick="this.select();" id="port_margem" data-width="110" data-height="110" data-min="0" data-displayprevious="true"  data-step="1"  data-fgcolor="#5fb7e0" data-thickness=".1">
								</div>
								<div class="col-md-10">
									<div class="p-3" >
									<div class="tbcontrato">
										<table id="datatable" class=" table-bordered" >
											<thead>
											 <tr id="tab_portabilidade_head">
												 <th class="thtable" id="port_banco">Banco</th>
												 <th class="thtable" id="port_contrato">Contrato</th>
												 <th class="thtable" id="port_valor_emprestimo">Valor Empréstimo</th>
												 <th class="thtable" id="port_num_parc">N. Parcelas</th>
												 <th class="thtable" id="port_valor_mensal">Valor Mensal</th>
												 <th class="thtable" id="port_saldo_dev">Saldo Dev.</th>
												 <th class="thtable" id="port_taxa">Taxa</th>
											 </tr>
											</thead>
											<tbody id="tab_portabilidade_body">
											</tbody>
										</table>
										</div>
									</div>
								</div>
							</div>
							<span class="text-muted">Portabilidade</span>
						</div>
					</div>
				</div>
			<!-- end col -->
			</div>
		</div> <!-- inspecting_call -->

		<div class="row" id="dashboard-pa">
				<div class="col-lg-12">
					<div class="card">
						<div class="card-body">
							<h5 class="mt-0">Dashboard</h5>
							<!-- Nav tabs -->
							<ul class="nav nav-tabs nav-tabs-custom nav-justified" role="tablist">
								<li class="nav-item"><a class="nav-link active" data-toggle="tab" href="#agendadospa" role="tab">Agendados</a></li>
								<li class="nav-item"><a class="nav-link" data-toggle="tab" href="#propostapa" role="tab">Propostas</a></li>
								<li class="nav-item"><a class="nav-link" data-toggle="tab" href="#documentos" role="tab">Documentos</a></li>
								<li class="nav-item"><a class="nav-link" data-toggle="tab" href="#centalwhat" role="tab">Central Whatsapp</a></li>
								<li class="nav-item"><a class="nav-link" data-toggle="tab" href="#buscapessoal" role="tab">Busca Pessoal</a></li>
								<li class="nav-item"><a class="nav-link" data-toggle="tab" href="#atualizador" role="tab">Atualizador</a></li>
								<li class="nav-item"><a class="nav-link" data-toggle="tab" href="#extrato" role="tab">Extrato</a></li>
							</ul>
							<!-- Tab panes -->
							<div class="tab-content">
								<div class="tab-pane active p-3" id="agendadospa" role="tabpanel">
									<div class="card-body font-13">
										<div class="col-sm-12 col-lg-12">
										 <table id="datatable" class="table table-bordered">
												<thead>
													<tr>
													<th>#</th>
													<th>Cliente</th>
													<th>Data Agendada</th>
													<th>Observação</th>
													<th>Ação</th>
													</tr>
												</thead>
												<tbody>
												<?php
													$agendamento = mysql_query("SELECT AGENDA.AGENDA_ID,AGENDA.AGENDA_DATA_CADASTRO,
																													   AGENDA.AGENDA_DATA, CLIENTE_INSS.CLI_NOME, CLIENTE_INSS.CLI_ID
																										  FROM `AGENDA`
																											INNER JOIN  CLIENTE_INSS ON  AGENDA.CLIENTE = CLIENTE_INSS.CLI_ID
																											WHERE AGENDA.OPERADOR='$operador' ORDER BY AGENDA.AGENDA_DATA DESC") or die(mysql_error());
													while($agendamentoB = mysql_fetch_array($agendamento))
													{
														$id_cliente = $agendamentoB['CLI_ID'];
														$nome_cliente 	= $agendamentoB['CLI_NOME'];
														$agenda_id 		= $agendamentoB['AGENDA_ID'];
														$data_agendada	= $agendamentoB['AGENDA_DATA'];
														$data_cadastro 	= date('d/m/Y H:i', strtotime($data_cadastro));
														$data_agendada 	= date('d/m/Y H:i', strtotime($data_agendada));
													?>

												 <tr>
													<td><?php echo $agenda_id ?></td>
													<td><?php echo $nome_cliente ?></td>
													<td><?php echo $data_agendada ?></td>
													<td><button  style=" font-size: 12px;" class=" btn btn-soft-info nav-link dropdown-toggle waves-effect waves-light nav-user tdbutton" data-toggle="modal" data-animation="bounce" data-target=".agenda_observacao<?php echo $agenda_id?>" role="button" aria-haspopup="false" aria-expanded="false"> Observação</button></td>
													<td><a><i data-id-cliente="<?php echo $id_cliente ?>" class="mdi mdi-phone-voip" style="font-size: 20px;"></i></a></td>
												 </tr>
												 <!-- modal agendamento -->

													<div class="modal fade agenda_observacao<?php echo $agenda_id?>" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
																<div class="modal-dialog modal-lg">
																	<div class="modal-content">
																		<div class="modal-header">
																			<h5 class="modal-title align-self-center mt-0" id="myLargeModalLabel">Observação Agendamento: <?php echo $nome_cliente?></h5>
																			<button type="button" class="close" data-dismiss="modal" aria-hidden="true" id="fecha1">×</button>
																		</div>
																			<div class="modal-body">
																			<div class="col-sm-12 col-lg-12 mo-b-15">
																			<section id="cd-timeline" class="cd-container">
																				<?php
																					$agendamentoobs = mysql_query("SELECT * FROM AGENDA WHERE AGENDA_ID = '$agenda_id' ORDER BY AGENDA_DATA DESC") or die(mysql_error());
																					while($agendamentoobsB = mysql_fetch_array($agendamentoobs))
																					{
																						$obs 			= $agendamentoobsB['AGENDA_OBS'];
																						$data_cadastro 	= $agendamentoobsB['AGENDA_DATA_CADASTRO'];
																						$data_agendada 	= $agendamentoobsB['AGENDA_DATA'];

																						$data_cadastro 	= date('d/m/Y H:i', strtotime($data_cadastro));
																						$data_agendada 	= date('d/m/Y H:i', strtotime($data_agendada));
																						echo '<div class="cd-timeline-block">
																			<div class="cd-timeline-img bg-success"><i class=" mdi mdi-alarm-check"></i></div>
																			<!-- cd-timeline-img -->
																			<div class="cd-timeline-content">
																			<p class="mb-0 font-13">'.$obs.'</p>
																			<p class="mb-0 font-13"><strong>Data Agendada: '.$data_agendada.'</strong></p>
																			<span class="cd-date">'.$data_cadastro.'</span>
																			</div>
																			<!-- cd-timeline-content -->
																			</div>';
																					}
																				?>
																			</section>
																		</div>
																			</div>
																			<div class="modal-footer">
																				<button type="button" class="btn btn-light waves-effect" data-dismiss="modal" id="fecha">Fechar</button>
																		</div>
																	</div>
																	<!-- /.modal-content -->
																</div>
																<!-- /.modal-dialog -->
															</div>
												 <!-- end modal agendamento -->
												<?php }?>
												</tbody>
												</table>
										</div>
									</div>
								</div>
								<div class="tab-pane p-3" id="propostapa" role="tabpanel">
									<div class="col-sm-12 col-lg-12">
												<table id="datatable" class="table table-bordered">
												<thead>
													<tr>
													<th>#</th>
													<th>Cliente</th>
													<th>Cadastrada em</th>
													<th>Status</th>
													</tr>
												</thead>
												<tbody>
												<?php
												$proposta = mysql_query("SELECT PROPOSTA.PROP_ID,PROPOSTA.PROP_DATA_CAD,PROP_SITUACAO.PROP_SITUACAO_DESC, CLIENTE_INSS.CLI_NOME,CLIENTE_INSS.CLI_ID, USUARIO.NOME FROM PROPOSTA
													INNER JOIN CLIENTE_INSS ON CLIENTE_INSS.CLI_ID = PROPOSTA.CLIENTE
													INNER JOIN PROP_SITUACAO ON PROPOSTA.SITUACAO = PROP_SITUACAO.PROP_SITUACAO_ID
													INNER JOIN USUARIO ON USUARIO.ID = PROPOSTA.OPERADOR
													WHERE PROPOSTA.OPERADOR = '$operador'  ")or die (mysql_error());
												while($est =  mysql_fetch_array($proposta))
												{
													$id 			= $est['PROP_ID'];
													$nome			= $est['CLI_NOME'];
													$cli_id			= $est['CLI_ID'];
													$data_cadastro 	= $est['PROP_DATA_CAD'];
													$status		 	= $est['PROP_SITUACAO_DESC'];
													$pa			 	= $est['NOME'];
													$nome 	=  strtolower ($nome);
													$nome	= ucwords($nome);
													$data_cadastro = date('d/m/Y H:i', strtotime($data_cadastro));

													if($status == 'Verificação')
													{
														$class = 'class="alert alert-warning"';
													}
													if($status == 'Digitação')
													{
														$class = 'class="alert alert-info"';
													}
													if($status == 'Cancelada')
													{
														$class = 'class="alert alert-danger"';
													}
													?>

													<tr>
													<td><?php echo $id ?></td>
													<td><?php echo $nome ?></td>
													<td><?php echo $data_cadastro ?></td>
													<td <?php echo $class ?>><?php echo $status ?></td>

													</tr>
												<?php }?>

												</tbody>
												</table>
									</div>
								</div>
								<div class="tab-pane p-3" id="centalwhat" role="tabpanel">
									<div class="col-sm-12 col-lg-12" id="div-iframe1">

									</div>
								</div>
								<div class="tab-pane p-3" id="buscapessoal" role="tabpanel">
									<div class="col-sm-12 col-lg-12" id="div-iframe2">

									</div>
								</div>
								<div class="tab-pane p-3" id="atualizador" role="tabpanel">
									<div class="col-sm-12 col-lg-12" id="div-iframe3">

									</div>
								</div>
								<div class="tab-pane p-3" id="extrato" role="tabpanel">
									<div class="col-sm-12 col-lg-12" id="div-iframe4">

									</div>
								</div>
								<div class="tab-pane p-3" id="documentos" role="tabpanel">
									<div class="col-sm-12 col-lg-12" id="div-iframe5">

									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			</div>

<!-- dados cliente -->
<div class="modal fade cliente" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
	<div class="modal-dialog modal-lg">
		<div class="modal-content" id="modal-dados-cliente">
			<div class="modal-header">
				<h5 class="modal-title align-self-center mt-0 nomedetalhe" id="myLargeModalLabel"></h5>
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
			</div>
			<div class="modal-body">
				<div class="table-responsive" id="tabela-dados-cliente">
					<table class="table mb-0" style="margin-bottom: 10px !important;">
						<thead>
							<tr>
								<th colspan="2" style="background-color: #ffff; border: 0; font-size: 16px;font-weight: 400; padding-left: 0px; padding-bottom: 7px;">Dados Pessoais</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td class="tabledit-view-mode"><span class="tabledit-span" id="cpf">CPF: </span></td>
								<td class="tabledit-view-mode"><span class="tabledit-span" id="nasc">Nasc:</span></td>
								<td class="tabledit-view-mode"><span class="tabledit-span" id="sexo">Sexo: </span></td>
								<td class="tabledit-view-mode"><span class="tabledit-span" id="idade">Idade:</span></td>
							</tr>
						</tbody>
					</table>
					<table class="table mb-0" style="margin-bottom: 10px !important;">
						<thead>
							<tr>
								<th style="background-color: #ffff; border: 0; font-size: 16px;font-weight: 400; padding-left: 0px; padding-bottom: 20px;">Endereço</th>
								<td colspan="5" align="right" style="border: 0px;text-align: right;">
									<a style="width: 160px;" href="#" class="btn btn-soft-info" data-toggle="modal" data-animation="bounce" data-target=".addendereco">Adicionar Endereço</a>
								</td>
							</tr>
						</thead>
						<tbody id="enderecotabela">
						<tfoot>
						</tfoot>
						</tbody>
					</table>
				  <table class="table mb-0" id="" style="margin-bottom: 10px !important;">
						<thead>
							<tr>
								<th style="background-color: #ffff; border: 0; font-size: 16px;font-weight: 400; padding-left: 0px; padding-bottom: 20px;">Telefones</th>
								<td colspan="5" align="right" style="border: 0px;text-align: right;">
									<a style="width: 160px;" href="#" class="btn btn-soft-info" data-toggle="modal" data-animation="bounce" data-target=".addtelefone">Adicionar Telefone</a>
								</td>
							</tr>
						</thead>
						<tbody id="telefonetabela">
						<tfoot>
						</tfoot>
						</tbody>
					</table>
				  <table class="table mb-0" id="" style="margin-bottom: 10px !important;">
						<thead>
							<tr>
								<th style="background-color: #ffff; border: 0; font-size: 16px;font-weight: 400; padding-left: 0px; padding-bottom: 20px;">Email</th>
								<td colspan="5" align="right" style="border: 0px;text-align: right;">
									<a style="width: 160px;" href="#" class="btn btn-soft-info" data-toggle="modal" data-animation="bounce" data-target=".addemail">Adicionar Email</a>
								</td>
							</tr>
						</thead>
						<tbody id="emailtabela">
						</tbody>
					</table>

			  </div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-light waves-effect" data-dismiss="modal">Fechar</button>
				<!-- <button type="button" class="btn btn-primary waves-effect waves-light">Save changes</button>-->
			</div>
		</div>
		<!-- /.modal-content -->
	</div>
	<!-- /.modal-dialog -->
</div>
<!-- dados matricula -->
		<div class="modal fade matricula" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title align-self-center mt-0" id="myLargeModalLabel">Detalhamento das Matrículas</h5>
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
					</div>
				  <div class="modal-body">
					<div class="table-responsive">
							<table class="table mb-0" id="my-table">
							<thead>
								<tr>
									<th style="background-color: #ffff; border: 0; font-size: 16px;font-weight: 400; padding-left: 0px; padding-bottom: 7px;">Dados Beneficio</th>
								</tr>
							</thead>
								<tbody class="matriculastabela">
								</tbody>
							</table>
							<table class="table mb-0" id="my-table">
								<thead>
									<tr>
										<th style="background-color: #ffff; border: 0; font-size: 16px;font-weight: 400; padding-left: 0px; padding-bottom: 7px;">Dados Bancários</th>
									</tr>
								</thead>
								<tbody class="matbancotabela">
								</tbody>
							</table>
						</div>
					</div>
					<div class="modal-footer">
						<button type="button" class="btn btn-light waves-effect" data-dismiss="modal">Fechar</button>
					<!-- <button type="button" class="btn btn-primary waves-effect waves-light">Save changes</button>-->
					</div>
				</div>
			<!-- /.modal-content -->
			</div>
			<!-- /.modal-dialog -->
		</div>
<!-- Agendar novo endereco-->
		<div class="modal fade addendereco" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title align-self-center mt-0" id="myLargeModalLabel">Adicionar Novo Endereço</h5>
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
					</div>
					<div class="modal-body">
						<form id="endereco"  method="post" enctype="multipart/form-data">
						<input type="hidden" name="cliente" class="idcli">
							<div class="form-group row">
								<div class="col-sm-6 col-lg-6">
									<label for="cpf" class="col-form-label">Endereço e Numero</label>
									<input class="form-control"  type="text" id="Endereço" name="endereco" placeholder="Ex.: Rua Nome da Rua, 123">
								</div>
								<div class="col-sm-12 col-lg-3 mo-b-15">
									<label for="cpf" class="col-form-label">Bairro</label>
									<input class="form-control"  type="text" id="nome"  name="bairro" placeholder="Bairro">
								</div>
								<div class="col-sm-12 col-lg-3">
									<label for="cpf" class="col-form-label">Cidade</label>
									<input class="form-control"  type="text" id="example-email-input3" name="cidade" placeholder="Cidade">
								</div>
								<div class="col-sm-12 col-lg-3">
									<label for="cpf" class="col-form-label">CEP</label>
									<input class="form-control"  type="text" id="example-email-input3" name="cep" placeholder="CEP" >
								</div>
								<div class="col-sm-12 col-lg-3">
									<label for="cpf" class="col-form-label">UF</label>
									<input class="form-control"  type="text" id="example-email-input3" name="estado" placeholder="Estado" >
								</div>
							</div>
						<div id="res_server_endereco" style="margin-top: 10px"></div>
					</div>
					<div class="modal-footer">
					<button type="button" class="btn btn-light waves-effect" data-dismiss="modal">Fechar</button>
					<button type="submit" class="btn btn-primary waves-effect waves-light">Cadastrar</button>

					</div>
				</form>

				</div>
			<!-- /.modal-content -->
			</div>
		<!-- /.modal-dialog -->
		</div>

<!-- add telefone -->
		<div class="modal fade addtelefone" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title align-self-center mt-0" id="myLargeModalLabel">Adicionar Novo Endereço</h5>
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
					</div>
					<div class="modal-body">
						<form id="telefone"  method="post" enctype="multipart/form-data">
						<input type="hidden" name="cliente" class="idcli">
							<div class="form-group row">
								<div class="col-sm-12 col-lg-2">
									<label for="ddd" class="col-form-label">DDD</label>
									<input class="form-control"  type="text" id="ddd" name="ddd" placeholder="DDD">
								</div>
								<div class="col-sm-12 col-lg-3 mo-b-15">
									<label for="cpf" class="col-form-label">Telefone</label>
									<input class="form-control"  type="text" id="telefone"  name="telefone" placeholder="Telefone">
								</div>
								<div class="custom-control custom-radio my-2">
								<input  type="checkbox" id="customRadio1" name="whatsapp" class="custom-control-input" >
								<label class="custom-control-label" for="customRadio1">Whatsapp</label>
								</div>
							</div>
						<div id="res_server_telefone" style="margin-top: 10px"></div>
					</div>
					<div class="modal-footer">
					<button type="button" class="btn btn-light waves-effect" data-dismiss="modal">Fechar</button>
					<button type="submit" class="btn btn-primary waves-effect waves-light">Cadastrar</button>

					</div>
				</form>

				</div>
			<!-- /.modal-content -->
			</div>
		<!-- /.modal-dialog -->
		</div>

<!-- add email -->
		<div class="modal fade addemail" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title align-self-center mt-0" id="myLargeModalLabel">Adicionar Novo E-mail</h5>
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
					</div>
					<div class="modal-body">
						<form id="email" method="post" enctype="multipart/form-data">
							<input type="hidden" name="cliente" class="idcli">
							<div class="form-group row">
								<div class="col-sm-12 col-lg-6">
									<label for="email" class="col-form-label">E-mail</label>
									<input class="form-control" size="75" type="email" id="email" name="email" placeholder="email@provedor.com">
								</div>
							</div>
						<div id="res_server_email" style="margin-top: 10px"></div>
					</div>
					<div class="modal-footer">
					<button type="button" class="btn btn-light waves-effect" data-dismiss="modal">Fechar</button>
					<button type="submit" class="btn btn-primary waves-effect waves-light">Cadastrar</button>

					</div>
				</form>

				</div>
			<!-- /.modal-content -->
			</div>
		<!-- /.modal-dialog -->
		</div>

<!-- agendamento -->
		<div class="modal fade 	agendar" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title align-self-center mt-0" id="myLargeModalLabel">Agendar</h5>
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true" id="fecha1">×</button>
					</div>
					<form id="agendamento"  method="post" enctype="multipart/form-data">
						<div class="modal-body">

								<p>
								<div class="col-sm-6 col-lg-6 mo-b-15">
									<label>Data e Hora</label>
									<input class="form-control" type="datetime-local" name="dia" placeholder="Nome">
								</div>

								<div class="col-sm-12 col-lg-12 mo-b-15">
								<div class="form-group" style="margin-top: 10px">
									<textarea class="form-control" id="exampleFormControlTextarea1" name="observacao" rows="4" placeholder="Observação"></textarea>
								  </div>
								</div>
								<div id="res_server" style="margin-top: 10px"></div>
							</p>
						</div>
						<div class="modal-footer">
						<div class="col-sm-12 col-lg-12 mo-b-15">
							<button type="button" class="btn btn-light waves-effect" data-dismiss="modal" id="fecha">Fechar</button>
							<button type="submit" class="btn btn-primary waves-effect waves-light">Agendar</button>
					</div>
					</div>
					</form>
				</div>
				<!-- /.modal-content -->
			</div>
			<!-- /.modal-dialog -->
		</div>
		<!-- Dashboard -->


		<div class="modal fade 	documento" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
			<div class="modal-dialog modal-lg">
				<div class="modal-content">
					<div class="modal-header">
						<h5 class="modal-title align-self-center mt-0" id="myLargeModalLabel">Documentos</h5>
						<a href="#"  id="solicita_documentos" class=" btn btn-soft-info waves-effect waves-light nav-user tdbutton" style=" margin: 0 9%;width: 140px;font-weight: 500;" data-toggle="modal" data-animation="bounce" data-target=".link-input">Solicitar Documentos</a>
						<!-- button type="submit" id="solicita_documentos" class=" btn btn-soft-info waves-effect waves-light nav-user tdbutton" style=" margin: 0 9%;width: 140px;font-weight: 500;">Solicitar Documentos</button> -->
						<button type="button" class="close" data-dismiss="modal" aria-hidden="true" id="fecha1">×</button>
					</div>
						<div class="modal-body">
							<div class="col-lg-12">
			            <ul class="nav nav-tabs nav-tabs-custom" role="tablist">
			              <li class="nav-item"><a class="nav-link active show" data-toggle="tab" href="#selfie" role="tab" aria-selected="true">Selfie</a></li>
			              <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#cpf" role="tab" aria-selected="false">CPF</a></li>
			              <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#cnh" role="tab" aria-selected="false">CNH</a></li>
			              <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#rg" role="tab" aria-selected="false">RG</a></li>
			              <li class="nav-item"><a class="nav-link" data-toggle="tab" href="#compresidencia" role="tab" aria-selected="false">Comprovante Endereço</a></li>
			            </ul>
			            <!-- Tab panes -->
			            <div class="tab-content">
			              <div class="tab-pane p-3 active show" id="selfie" role="tabpanel">
											<embed id="selfie-image" src="assets/images/documentos/not-found.png" frameborder="0" width="100%" height="100%"style="margin: 1rem 4rem; width: 58%; ">

			              </div>
			              <div class="tab-pane p-3" id="cpf" role="tabpanel">
											<embed id="cpf-image" src="assets/images/documentos/not-found.png" frameborder="0" width="100%" height="100%"style="margin: 1rem 4rem; width: 58%; ">

			              </div>
			              <div class="tab-pane p-3" id="cnh" role="tabpanel">
											<embed id="cnh-image" src="assets/images/documentos/not-found.png" frameborder="0" width="100%" height="100%"style="margin: 1rem 4rem; width: 58%; ">

			              </div>
										<div class="tab-pane p-3" id="RG" role="tabpanel">
											<embed id="rg-frente-image" src="assets/images/documentos/not-found.png" frameborder="0" width="100%" height="100%"style="margin: 1rem 4rem; width: 58%; ">
											<embed id="rg-verso-image" src="assets/images/documentos/not-found.png" frameborder="0" width="100%" height="100%"style="margin: 1rem 4rem; width: 58%; ">

			              </div>
			            </div>
			          </div>
			      </div>
					</div>
					</div>
				</div>
				<!-- /.modal-content -->


						<div id="link-input-modal" class="modal fade link-input" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true" style="display: none; padding-right: 17px;">
							<div class="modal-dialog">
								<div class="modal-content">
									<div class="modal-header">
										<h5 class="modal-title align-self-center mt-0" id="myModalLabel">Link para solicitação</h5>
										<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
									</div>
									<div class="link-input-modal-body">
									</div>
									<div class="modal-footer">
										<button type="button" class="btn btn-light waves-effect" data-dismiss="modal">Fechar</button>
									</div>
								</div><!-- /.modal-content -->
							</div><!-- /.modal-dialog -->
						</div>




			</div> <!-- wrapper -->
			<!-- /.modal-dialog -->
		</div>
		<!-- Dashboard -->



<!-- container -->
		<?php include 'includes/footer.php'; ?>
		</div>
		<div id="hidden-id" data-id-cli="" style="display: none;"></div>

		<!-- Range slider js -->
		<script src="assets/plugins/ion-rangeslider/ion.rangeSlider.min.js"></script>
		<script src="assets/pages/jquery.range-sliders.js"></script>

		<!-- App js -->
		<script src="assets/js/app.js"></script>
		<script src="assets/plugins/jquery-knob/excanvas.js"></script>
		<script src="assets/plugins/jquery-knob/jquery.knob.min.js"></script>
		<script src="assets/pages/jquery.charts-knob.js"></script>
		<script src="assets/plugins/moment/moment.js"></script>
		<script type="text/javascript" src="assets/plugins/x-editable/js/bootstrap-editable.min.js"></script>
		<script type="text/javascript" src="assets/pages/jquery.xeditable.init.js"></script>

		<!-- Dropzone js -->
		<script src="assets/plugins/dropzone/dist/dropzone.js"></script>
		<script src="assets/plugins/dropify/js/dropify.min.js"></script>
		<script src="assets/pages/jquery.dropzone.init.js"></script>

		<script src="js/alertbox.js"></script>

<script>

let id_pausa;
var idcli;
var ramal_ativo = parseInt(<?php echo $ramal?>);
let operador = parseInt(<?php echo $operador ?>);
let idagencia = parseInt(<?php echo $idagencia ?>);

var  formatter = new Intl.NumberFormat('pt-BR', {
	style: 'currency',
	currency: 'BRL',
	minimumFractionDigits: 2
})

/*** GLOBAL FUNCTIONS ***/

const sleep = (milliseconds) => { return new Promise(resolve => setTimeout(resolve, milliseconds)) }

function trim_banco(nome_do_banco) {
	if((nome_do_banco.trim().substring(0, 5).toLowerCase() == "banco") && (nome_do_banco != "Banco do Brasil S.A.")) {
		return nome_do_banco.substr(5).trim();
	};
	return(nome_do_banco);
}

function isMarkedClass(booleanValid) {
	var marked_class = "";
	if(booleanValid == 1 || booleanValid == "1" || booleanValid == true) marked_class = "mdi mdi-checkbox-marked-circle";
 	if(booleanValid == 0 || booleanValid == "0" || booleanValid == false) marked_class = "mdi mdi-checkbox-marked-circle-outline";
	return marked_class;
}

function appendObjTo(thatArray, newObj) {
  const frozenObj = Object.freeze(newObj);
  return Object.freeze(thatArray.concat(frozenObj));
}


function validarElemento(id, tipo, valido) {
	let elementSelector = ".validar-"+tipo+"-"+id;
	$.ajax({
		url:'functions/validadados.php',
		type:'POST',
		cache: false,
		data: {id_elemento: parseInt(id), tipo: tipo, valido: valido },
		success: (data) => {
			let uncheckedMark = 'mdi-checkbox-marked-circle-outline';
			let checkedMark = 'mdi-checkbox-marked-circle';

			let newValid = valido ? 0 : 1;

			 if(valido == 0) { $(elementSelector).removeClass(uncheckedMark).addClass(checkedMark); }
			 else { $(elementSelector).removeClass(checkedMark).addClass(uncheckedMark); }
			 $(elementSelector).parent().attr("onclick", "validarElemento("+id+",'"+tipo+"', "+newValid+");");

			 if(tipo == 'telefone') // Se telefone, atualiza discado
			 {
				 let otherElement = '.validar-discado-'+id;
				 if(valido == 0) { $(otherElement).removeClass(uncheckedMark).addClass(checkedMark); }
				 else { $(otherElement).removeClass(checkedMark).addClass(uncheckedMark); }
				 $(otherElement).parent().attr("onclick", "validarElemento("+id+",'discado', "+newValid+");");
			 }

			 if(tipo == 'discado') // Se discado, atualiza, telefone
			 {
				 let otherElement = '.validar-telefone-'+id;
				 if(valido == 0) { $(otherElement).removeClass(uncheckedMark).addClass(checkedMark); }
				 else { $(otherElement).removeClass(checkedMark).addClass(uncheckedMark); }
				 $(otherElement).parent().attr("onclick", "validarElemento("+id+",'telefone', "+newValid+");");
			 }

			 alertBox("validate", tipo, valido);
		},
	});
}

var chamando = setInterval(chamarapi,2500);
var count = 0;
var diskcount = 0;
function chamarapi()
{
	$.ajax({
		url:'functions/discador.php',
		type:'POST',
		data: { idagencia: idagencia },
		cache: false,
		success: (data) => {
			console.log("Discando ("+(++diskcount)+")");
		}
	});

	$.ajax({
		url:'functions/check_callstatus.php',
		type:'POST',
		data: {ramal:ramal_ativo, agencia: idagencia },
		cache: false,
		success: (data) =>
		{
				console.log("Chamando dados cliente número #"+(++count));
				data = JSON.parse(data);
				console.log("Ramal: "+data.dados.ramal);
				if(data.dados.ramal != 0) {
					dadosCliente(data);
				}
		}
	});
}

function chamarcliente()
{
	let idcli = parseInt($('#hidden-id').data("id-cli"));
	$.ajax({
		url:'functions/chamar_cliente.php',
		type:'POST',
		data: { idcli: idcli },
		cache: false,
		success: (data) => {
				data = JSON.parse(data);
				dadosCliente(data);
		}
	});
}

function dadosCliente(data) {

	const refin  = '1';
	const cartao = '2';
	const novo   = '3';
	const saque_complementar = '4';
	const portabilidade = '5';

	var operador = <?php echo $operador ?>;
	var agencia = <?php echo $idagencia ?>;
	var ramal = <?php echo $ramal ?>;

	var idcli   	= data.dados.idcli;
	var nome 		  = data.dados.nome;
	var cpf 		  = data.dados.cpf;
	var data_nasc = data.dados.nasc;
	var sexo 		  = data.dados.sexo;
	var idade		  = data.dados.idade;
	var destino		= data.dados.destino;
	var vazio    	= "N/A";

	var endObj	  	 = JSON.parse(data.dados.endereco);
	var telObj 			 = JSON.parse(data.dados.tel);
	var emailObj 	 	 = JSON.parse(data.dados.email);
	var matriculaObj = JSON.parse(data.dados.matricula);
	var bancoObj 		 = JSON.parse(data.dados.banco);
	var fatorObj 	   = JSON.parse(data.dados.fator);
	var contratoObj  = JSON.parse(data.dados.contrato);
	var rmcObj		 	 = JSON.parse(data.dados.rmc);

	$("#hidden-id").attr('data-id-cli', idcli);

	$.ajax({
		url:'functions/pausa.php',
		type:'POST',
		cache: false,
		data: {operador: operador, agencia:agencia, tipo_pausa: "Em atendimento", ramal: ramal, pause:'sim'},
		success: (data) =>	{
			data = JSON.parse(data);
			var	id_pausa = data.idpausa;
		}
	});

	/*** DADOS-ENDERECO ***/

	arrayEnderecosValidos = [];
	$("#enderecotabela").html("");
	for (let endereco of endObj["lista"])
	{
		var idend 	= endereco["CLI_END_ID"];
		var logra 	= endereco["CLI_END_LOGRA"];
		var bairro  = endereco["CLI_END_BAIRRO"];
		var cidade  = endereco["CLI_END_CIDADE"];
		var cep 	  = endereco["CLI_END_CEP"];
		var uf  	  = endereco["CLI_END_UF"];

		let valido = parseInt(endereco["CLI_END_VALIDO"]) ;

		if(valido){
			arrayEnderecosValidos = appendObjTo(arrayEnderecosValidos, {
				"idend": idend,
				"logra": logra,
				"bairro": bairro,
				"cidade": cidade,
				"cep": cep,
				"uf": uf,
			});
		}

		$("#enderecotabela").append(
			`<tr>
					<td class="tabledit-view-mode">
						<span class="validate_address sa-topright-success" onclick="validarElemento(`+idend+`,'endereco',`+valido+`)">
							<i class="validar-endereco-`+idend+` `+isMarkedClass(valido)+`" data-id_endereco="`+idend+`" style="font-size: 19px;"></i>
						</span>
					</td>
					<td class="tabledit-view-mode"><span class="tabledit-span" style="">`+logra+`</span></td>
					<td class="tabledit-view-mode"><span class="tabledit-span" style="">`+bairro+`</span></td>
					<td class="tabledit-view-mode"><span class="tabledit-span" style="">`+cidade+`</span></td>
					<td class="tabledit-view-mode"><span class="tabledit-span" style="">`+cep+`</span></td>
					<td class="tabledit-view-mode"><span class="tabledit-span" style="">`+uf+`</span></td>
			</tr>`
			);
	}

	/*** DADOS-TELEFONE ***/

	var array_telefones = []; // Usado para aparecer o Discado
	var arrayTelefonesValidos = []; // Usado no cadastro de proposta

	$("#telefonetabela").html("");
	for (j = 0; j < telObj["lista"].length; j++)
	{
		var idtel 	= telObj["lista"][j]["CLI_FONE_ID"];
		var telefone 	= telObj["lista"][j]["CLI_FONE"];

		let whatsapp_valido = parseInt(telObj["lista"][j]["CLI_FONE_WHATSAPP"]);
		let telefone_valido = parseInt(telObj["lista"][j]["CLI_FONE_VALIDADO"]);

		if(telefone_valido) {
			arrayTelefonesValidos = appendObjTo(arrayTelefonesValidos, {
				"idtel": idtel,
				"telefone": telefone,
				"telefone_valido": telefone_valido,
				"whatsapp_valido": whatsapp_valido,
			});
		}

		array_telefones.push([idtel, telefone, telefone_valido]);

 		let tdString= `<td class="tabledit-view-mode">
										 <span class="validate_whatsapp" onclick="validarElemento(`+idtel+`,'whatsapp',`+whatsapp_valido+`)">
											 <i class="validar-whatsapp-`+idtel+` `+isMarkedClass(whatsapp_valido)+`" style="font-size: 19px;"></i>
										 </span>
											 <i class="mdi mdi-whatsapp" style="font-size: 19px; color: #25D366; margin-right: 10px;"></i>
										 <span class="validate_phone" onclick="validarElemento('`+idtel+`','telefone',`+telefone_valido+`)">
											 <i class="validar-telefone-`+idtel+` `+isMarkedClass(telefone_valido)+`" style="font-size: 19px;"></i>
										 </span>
										 <span class="telefone" id="telefone">`+telefone+`</a></span>
									 </td>`;

		if (j % 3 == 0)
		{
			newRow = document.createElement("tr");
			$(newRow).append(tdString);
			$("#telefonetabela").append(newRow);
	  }
		else
		{
			$('#telefonetabela tr:last').append(tdString);
		}

	}

	/*** DADOS-NUMERO-DISCADO ***/

	// TELEFONE
	// 0 -> código/idea
	// 1 -> telefone
	// 2 -> valido? (0?1)

	if(destino) { $("#td-telativo").html(`<div id="telativo" style="float: right; margin-left: 5px; margin-top: 5px;">`+destino+`</div>`); }

	for (var z = 0; z < array_telefones.length; z++) {
		let telefone = parseInt(array_telefones[z][1]);
		let telefoneDiscado = parseInt(destino);

		if(telefone == telefoneDiscado) {
			let id = array_telefones[z][0];
			let valido = array_telefones[z][2];

			$("#td-telativo").append(`
				<span class="validate_phone" onclick="validarElemento(`+id+`,'discado',`+valido+`)">
					<i class="validar-discado-`+id+` `+isMarkedClass(valido)+`" style="font-size: 19px;"></i>
				</span>
				`);
			break;
		}
	}


	/*** DADOS-EMAIL ***/

	$("#emailtabela").html("");
	let arrayEmailsValidos = [];
	for (k = 0; k < emailObj["lista"].length; k++)
	{
		var idemail = emailObj["lista"][k]["CLI_EMAIL_ID"];
		var email 	= emailObj["lista"][k]["CLI_EMAIL"];

		let email_valido = emailObj["lista"][k]["CLI_EMAIL_VALIDADO"];

		let tdString = `<td class="tabledit-view-mode">
											<span class="validate_email" onclick="validarElemento(`+idemail+`,'email',`+email_valido+`)">
												<i class=" validar-email-`+idemail+` `+isMarkedClass(email_valido)+`" style="font-size: 19px;"></i>
											</span>
											<span class="tabledit-span" style="">`+email+`</span>
										 </td>`;

		if(email_valido){
			arrayEmailsValidos = appendObjTo(arrayEmailsValidos, {
  			"idemail": idemail,
  			"email": email,
  			"email_valido": email_valido,
  		});
		}


		if(k % 3 == 0)
		{
				newRow = document.createElement("tr");
				$(newRow).append(tdString);
				$("#emailtabela").append(newRow);
		}
		else
		{
			$("#emailtabela tr:last").append(tdString);
		}

	}

	$(".matriculastabela").html("");
	$(".matbancotabela").html("");

	/*** DADOS-BENEFICIOS ***/

	arrayBeneficios = []; // Usado posteriormente no cadastro de proposta
	for (let matricula of matriculaObj["lista"])
	{
		var idben 			   			= matricula["CLI_BEN_ID"] || vazio;
		var ben_nb 		       		= matricula["CLI_BEN_NB"] || vazio;
		var ben_dib  	        	= matricula["CLI_BEN_DIB"];
		var ben_salario         = matricula["CLI_BEN_SALARIO"] || vazio;
		var ben_especie 	   		= matricula["CLI_BEN_ESPECIE"] || vazio;
		var ben_margem  	    	= matricula["CLI_BEN_MARGEM"] || vazio;
		var ben_banco_recebe    = matricula["CLI_BEN_BANCO_RECEBE"] || vazio;
		var ben_agencia_recebe 	= matricula["CLI_BEN_AGENCIA_RECEBE"] || vazio;
		var ben_conta_recebe 		= matricula["CLI_BEN_CONTA_RECEBE"] || vazio;


		arrayBeneficios = appendObjTo(arrayBeneficios, {
			"idben": idben,
			"ben_nb": ben_nb,
			"ben_dib": ben_dib,
			"ben_salario": ben_salario,
			"ben_especie": ben_especie,
			"ben_margem": ben_margem,
			"ben_banco_recebe": ben_banco_recebe,
			"ben_agencia_recebe": ben_agencia_recebe,
			"ben_conta_recebe": ben_conta_recebe,
		});


		$(".matriculastabela").append(
			`<tr><td class="tabledit-view-mode"><span class="tabledit-span" style="">NB: `+ben_nb+` </span></td>
			 <td class="tabledit-view-mode"><span class="tabledit-span" style="">Data Inicio: `+ben_dib+`</span></td>
			 <td class="tabledit-view-mode"><span class="tabledit-span" style="">Espécie: `+ben_especie+`</span></td>
			 <td class="tabledit-view-mode"><span class="tabledit-span" style="">Salario: `+formatter.format(parseFloat(ben_salario))+`</span></td></tr>`
			);

		$(".matbancotabela").append(
			`<tr><td class="tabledit-view-mode"><span class="tabledit-span" style="">Banco: `+ben_banco_recebe+` </span></td>
			 <td class="tabledit-view-mode"><span class="tabledit-span" style="">Agência: `+ben_agencia_recebe+`</span></td>
			 <td class="tabledit-view-mode"><span class="tabledit-span" style="">Conta Corrente:`+ben_conta_recebe+`</span></td></tr>`
			);
	}

	// CALCULOS

	$("#novo_margem").val(Math.round(parseFloat(ben_margem.replace(",","."))));
	$('#cliNome').html("Nome: "+nome);
	$('.nomedetalhe').html("Detalhamento "+nome);
	$('#cpf').html("CPF: "+cpf);
	$('#nasc').html("Data de Nascimento: "+data_nasc);
	$('#sexo').html("Sexo: "+sexo);
	$('#idade').html("Idade: "+idade);
	$('#cliMatricula').html("Ver Matrícula");
	$('.idcli').val(idcli);

	$("#waiting_for_call").css("display", "none"); // Tira aguardando chamada
	$("#inspecting_call").css("display", "block"); // Mostra dados cliente
	$("#dados_cliente").css("display", "block");   // Mostra cabeçalho cliente

	$("#cartao_margem").val(Math.round(parseFloat(ben_salario)*0.05));
	$("#saque_margem").val(Math.round(parseFloat(ben_salario)*0.05));
	$("#port_margem").val(Math.round(parseFloat(ben_margem.replace(",","."))));

	if(parseFloat(ben_margem) <= 20)
	{
		$("#novo_card").css("display","none");
		$("#cartao_card").css("display","none");
	}

	var array_parcelas = [];

	$("#tab_novo_head").html("");
	$("#tab_novo_td").html("");
	$("#prazo_novo").html("");


	/*** DADOS-BANCO ***/

	for (m = 0; m < bancoObj["lista"].length; m++)
	{
		var grupoidbanco = bancoObj["lista"][m]["GRUPO_IDBANCO"];
		var grupobanco   = bancoObj["lista"][m]["GRUPO_BANCO"];
		var grupoproduto = bancoObj["lista"][m]["GRUPO_PRODUTO"];

		if (grupoproduto == novo)
		{
			$("#tab_novo_head").append(`<th class="thtable" data-idbanco="`+grupoidbanco+`" style="border: 1;">`+trim_banco(grupobanco)+`</th>`);
			for (n = 0; n < fatorObj["lista"].length; n++)
			{
				if(grupoidbanco != fatorObj["lista"][n]["BANCO_ID"]) continue;
				var fator 			 = fatorObj["lista"][n]["FATOR"];
				let fatorparcela = fatorObj["lista"][n]["FT_PARCELA"];
				let margem = $("#novo_margem").val();

				var calculonovo = parseFloat(margem) / parseFloat(fator);
				// console.log("CALCULO NOVO: "+parseFloat(margem)+"/"+parseFloat(fator)+"="+calculonovo);

				if(!array_parcelas.includes(fatorparcela))
				{
					$("#prazo_novo").append('<option>'+fatorparcela+'</option>');
					array_parcelas.push(fatorparcela);
					array_parcelas.sort();
				}
			}

			//------------------------------------------------------------
			//                   SCRIPT GERADOR DE PROPOSTA
			//------------------------------------------------------------

			$("#tab_novo_td").append(`<td class="thtable" id="calculo-banco-`+grupoidbanco+`" data-calculo="`+grupoidbanco+`"><a id="recalc-banco-`+grupoidbanco+`" class="cal_novo btn btn-soft-info tdbutton">`+formatter.format(calculonovo)+`</a></td>`);
			// let calculonovo = (calculonovo+"").replace(".",",");
			$("#recalc-banco-"+grupoidbanco.toString()).click(function(){
					$("input#cpf").val(cpf).attr("readonly",true);
					$("input#nome").val(nome).attr("readonly",true);
					$("input#data_nasc").val(data_nasc).attr("readonly",true);
					$("input#sexo").val(sexo).attr("readonly",true);

					if(arrayBeneficios[0]) {
						$("input#nb").val(arrayBeneficios[0]["ben_nb"]).attr("readonly",true);
						$("input#especie").val(arrayBeneficios[0]["ben_especie"]).attr("readonly",true);
						$("input#codbanco").val(arrayBeneficios[0]["ben_banco_recebe"]).attr("readonly",true);
						$("input#agencia").val(arrayBeneficios[0]["ben_agencia_recebe"]).attr("readonly",true);
						$("input#conta").val(arrayBeneficios[0]["ben_conta_recebe"]);
						$("input#especie").val(arrayBeneficios[0]["ben_especie"]).attr("readonly",true);
					}

					for(let telefoneValido of arrayTelefonesValidos) {
						let idtel = telefoneValido["idtel"];
						let telefone = telefoneValido["telefone"];
						$("select#telefone").append(`<option value="`+idtel+`">`+telefone+`</option>`);
					}

					for (let enderecoValido of arrayEnderecosValidos) {
						let idend = enderecoValido["idend"];
						let logra = enderecoValido["logra"];
						let bairro = enderecoValido["bairro"];
						let cidade = enderecoValido["cidade"];
						let cep = enderecoValido["cep"];
						let uf = enderecoValido["uf"];

						let endereco_completo = logra + " - " + bairro + " - " + cidade + "/" + uf;
						$("select#idend").append(`<option value="`+idend+`">`+endereco_completo+`</option>`);
					}

					for (let emailValido of arrayEmailsValidos) {
						let idemail = emailValido["idemail"];
						let email = emailValido["email"];
						$("select#email").append(`<option value="`+idemail+`">`+email+`</option>`);

					}

					$(function(){
						$('#cadastro-proposta').submit(function(event){
							event.preventDefault();
							let formDados = new FormData($(this)[0]);

							formDados.append('idcli', idcli);
							formDados.append('idtelefone', arrayTelefonesValidos[0]["idtel"]);
							// formDados.append('idendereco', arrayEnderecosValidos[0]["idend"]);
							formDados.append('idemail', arrayEmailsValidos[0]["idemail"]);
							formDados.append('idnb', arrayBeneficios[0]["idben"]);

							let resultado;
							$.ajax({
								url:'functions/cadproposta.php',
								type:'POST',
								data:formDados,
								cache:false,
								contentType:false,
								processData:false,
								success:function (data)
								{
									console.log(data);
								},
								dataType:'html'
							});
						return false;
						});
					});


				$("#form-proposta").css("display","block");
				$("#inspecting_call").css("display","none");
				$("#dashboard-pa").css("display","none");
			});
			// href="CadNovo/`+idcli+`/`+novo+`/`+grupoidbanco+`/`+(calculonovo+"").replace(".",",")+`
		}
		if(grupoproduto == saque_complementar)
		{
			$("#tab_saque_head").html("");
			$("#tab_saque_td").html("");
			for (o = 0; o < rmcObj["lista"].length; o++)
			{
				let banco_rcm = rmcObj["lista"][o]["CLI_BANCO_RMC"];
				let saque_margem = $("#saque_margem").val();
				if(banco_rcm != undefined && banco_rcm != null)
				{
					$("#tab_saque_head").append(`<th class="thtable"  style="border: 1;">`+trim_banco(grupobanco)+`</th>`);
					let calculocartao = Math.round(parseFloat(ben_salario)*0.05)*27;
					$("#tab_saque_td").append(`<td class="thtable"><a href="CadNovo/`+idcli+`/`+saque_margem+`/`+grupoidbanco+`/`+(calculocartao+"").replace(".",",")+`" class="cal_novo btn btn-soft-info tdbutton">`+formatter.format(calculocartao)+`</a></td>`);
					$("#cartao_card").css("display", "none");
					$("#saque_complementar_card").css("display", "block");
				}
			}
		}
		if(grupoproduto == cartao)
		{
			let calculocartao = Math.round(parseFloat(ben_salario)*0.05)*27;
			$("#table-cartao").html("");
			$("#table-cartao").append(
				`<table id="datatable" class=" table-bordered" style="margin-bottom: 10px;">
					<thead>
						<tr>
							<th class="thtable"  style="border: 1;">`+trim_banco(grupobanco)+`</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td class="thtable"><a href="CadNovo/`+idcli+`/`+cartao+`/`+grupoidbanco+`/`+(calculocartao+"").replace(".",",")+`" class="cal_novo btn btn-soft-info tdbutton">`+formatter.format(calculocartao)+`</a></td>
						</tr>
					</tbody>
					</table>`);
		}

		if(grupoproduto == portabilidade)
		{
			$("#portabilidade_card").css("display","block");
			$("#tab_portabilidade_body").html("");
			for (p = 0; p < contratoObj["lista"].length; p++)
			{
				let cli_contrato_id		 = contratoObj["lista"][p]["CLI_CONTRATO_ID"];
				let cli_cont_banco		 = contratoObj["lista"][p]["CLI_CONT_BANCO"];
				let cli_cont_codbanco  = contratoObj["lista"][p]["CLI_CONT_BANCO"];
				let cli_num 					 = contratoObj["lista"][p]["CLI_NUM_CONT"];
				let cli_vlr_emp 			 = contratoObj["lista"][p]["CLI_VLR_EMP"];
				let cli_cont_incio 		 = contratoObj["lista"][p]["CLI_CONT_INICIO"];
				let cli_cont_fim 			 = contratoObj["lista"][p]["CLI_CONT_FIM"];
				let cli_quant_parc 		 = contratoObj["lista"][p]["CLI_CONT_QUANT_PARC"];
				let cli_valor_parc 		 = contratoObj["lista"][p]["CLI_CONT_VALOR_PARC"];
				let cli_parc_paga 		 = contratoObj["lista"][p]["CLI_CONT_PARC_PAGA"];
				let cli_parc_a_pagar 	 = contratoObj["lista"][p]["CLI_CONT_PARC_A_PAGAR"];
				let cli_saldo_dev 		 = contratoObj["lista"][p]["CLI_CONT_SALDO_DEV"];
				let cli_taxa 					 = contratoObj["lista"][p]["CLI_CONT_TAXA"];
				let cli_averbacao 	   = contratoObj["lista"][p]["CLI_CONT_AVERBACAO"];
				// $("#tab_portabilidade_head").append(`<th class="thtable"  style="border: 1;">`+trim_banco(cli_cont_banco)+`</th>`);
				$("#tab_portabilidade_body").append(
					`<tr>
						<td class="thtable">`+cli_cont_banco+`</td>
						<td class="thtable">`+cli_num+`</td>
						<td class="thtable">`+formatter.format(cli_vlr_emp)+`</td>
						<td class="thtable">`+cli_parc_paga+`/`+cli_quant_parc+`</td>
						<td class="thtable">`+formatter.format(cli_valor_parc)+`</td>
						<td class="thtable">`+formatter.format(cli_saldo_dev)+`</td>
						<td class="thtable">`+cli_taxa+`</td>
					</tr>`
				);
			}
		}

	}

	$("#prazo_novo").html($("#prazo_novo option").sort(function (a, b) {
			return a.text == b.text ? 0 : a.text < b.text ? -1 : 1;
	}));

	var bancosexibidos = [];
	$("#prazo_novo").change(function(e){
			let numero_parcelas = $("#prazo_novo option:selected").text();
			$.ajax({
				url:'functions/parcelabox.php',
				type:'POST',
				data: { agencia: 1, parcela: numero_parcelas },
				cache: false,
				success: (data) =>
				{
							let margem = $("#novo_margem").val();
							let lista = JSON.parse(data);
							lista = lista["lista"];
							var array_displayed_banks = [];
							$('#tab_novo_td td').each(function( index ) {
								array_displayed_banks.push(parseInt($( this ).attr("data-calculo")));
							});
						 for (var q = 0; q < lista.length; q++)
						 {
								for (var r = 0; r < array_displayed_banks.length; r++) {
										let idbanco = array_displayed_banks[r];
										let bancofatores = lista[q][idbanco];
										if(bancofatores==undefined) continue;

										let todas_parcelas = [];
										for (var s = 0; s < bancofatores.length; s++) {
											let fator = bancofatores[s]["FATOR"];
											let parcela = bancofatores[s]["PARCELA"];
											todas_parcelas.push(parseInt(parcela));
											if(parcela==numero_parcelas) {
												let calculonovo = margem/ fator.replace(",",".");
												$("a#recalc-banco-"+idbanco).html(formatter.format(calculonovo));
												setAvailableStyle(idbanco);
											}
										}

										if(!todas_parcelas.includes(parseInt(numero_parcelas)))
										{
											setUnavailableStyle(idbanco);
										}

								}

						 }

						 function setUnavailableStyle(idbanco) {
							 $("a#recalc-banco-"+idbanco).html("Indisponível");
							 $("a#recalc-banco-"+idbanco).css("padding","6px 16px");
							 $("a#recalc-banco-"+idbanco).addClass('alert alert-danger');
							 $("a#recalc-banco-"+idbanco).removeClass('cal_novo btn btn-soft-info tdbutton');
							 $("a#recalc-banco-"+idbanco).off('click', function(event){event.stopPropagation()});
							 $("a#recalc-banco-"+idbanco).css("pointer-events", "none");
						 }

						 function setAvailableStyle(idbanco) {
							 $("a#recalc-banco-"+idbanco).removeClass('alert alert-danger');
							 $("a#recalc-banco-"+idbanco).css("padding","unset");
							 $("a#recalc-banco-"+idbanco).addClass('cal_novo btn btn-soft-info tdbutton');
							 $("a#recalc-banco-"+idbanco).on('click', function(event){event.stopPropagation()});
							 $("a#recalc-banco-"+idbanco).css("pointer-events", "auto");
						 }
					}
				});
	});

	clearInterval(chamando);
	for(i=0; i<100; i++) { window.clearInterval(i);}
}

function startLigacao()
{
	clearInterval(chamando);
	$("#waiting_for_call").css("display", "none");  								 // Não exibe aguardando chamada
	$("#inspecting_call").css("display", "none");  									 // Não exibe os dados cliente
	$("#dados_cliente").css("display", "none");                      // Não exibe cabeçalho cliente
	$("#set_on").css("display", "flex");                             // Exibe botão de continuar
	$("#status_switch_text").html("INICIAR");
	$("#pausa_menu").css("visibility","hidden");                     // Não exibe Dropdown On/Off menu
	$("i.mdi-chevron-down").css("display", "none");                  // Não exibe icone do Dropdown
	$("i.mdi-pause-octagon-outline").css("display","none");          // Não exibe icone de pausado
	$("p.set_on").html(`Iniciar Chamada <i class="mdi mdi-phone">`); // Exibe Iniciar Chamada e icone play
	$("#dashboard-pa").css("display","block");											 // Exibe o Dashboard do PA (embaixo)
}

function pausarligacao()
{
	clearInterval(chamando);
	$("#waiting_for_call").css("display", "none");  // Não exibe aguardando chamada
	$("#inspecting_call").css("display", "none");   // Não exibe os dados cliente
	$("#dados_cliente").css("display", "none");     // Não exibe cabeçalho cliente
	$("#set_on").css("display", "flex");            // Exibe botão de continuar
	$("#status_switch_text").html("ON");
	$("#pausa_menu").css("visibility","hidden");    // Não exibe Dropdown On/Off menu
	$("i.mdi-chevron-down").css("display", "none"); // Não exibe icone do Dropdown
	$("i.mdi-pause-octagon-outline").css("display","block"); // Exibe icone de pausado
}

function retornaraligar()
{
	$("#waiting_for_call").css("display", "flex");
	$("#inspecting_call").css("display", "none");
	$("#dados_cliente").css("display", "none");
	$("#set_on").css("display", "none");
	$("#status_switch_text").html("OFF");
	$("i.mdi-chevron-down").css("display", "unset");
	$("#pausa_menu").css("visibility", "visible");
	setInterval(chamarapi, 2500);
}

var tipo_pausa =  $("#status_switch_text").attr('data-tipo_pausa');
$('.set_on').on('click', (e) => {
	pausarligacao();
	// Registrar pausa no banco de dados, e retornar a data da pausa
	$.ajax({
		url:'functions/pausa.php',
		type:'POST',
		cache: false,
		data: {operador: operador, agencia:idagencia, tipo_pausa: tipo_pausa, ramal: ramal_ativo ,pause:'sim'},
		success: (data) => {
			// data = JSON.parse(data);
			// var id_pausa = data.idpausa;

			$("#retornopausa").html(data.pausaretorno);

			}
		});
})

$('.set_on').on('click', (e) => {
	$.ajax({
		url:'functions/pausa.php',
		type:'POST',
		cache: false,
		data: {operador: operador, agencia:idagencia, tipo_pausa: tipo_pausa, ramal: ramal_ativo ,pause:"nao", id_pausa: id_pausa},
		success: (data) => {
			retornaraligar();
			}
		});
});

$('.botao_tabular').on('click', (e) => {
	let id_tabulacao = $(e.target).attr('data-id_tabulacao');
	$.ajax({
		url:'functions/pausa.php',
		type:'POST',
		data: {operador: operador, agencia:idagencia, tipo_pausa: tipo_pausa, ramal: ramal_ativo ,pause:'nao', id_pausa: id_pausa},
		success: (data) => {
					retornaraligar();
			}
		});
});

$(function(){
	$('#endereco').submit(function(event){
		event.preventDefault();
		let formDados = new FormData($(this)[0]);
		let resultado;
		$.ajax({
			url:'functions/addendereco.php',
			type:'POST',
			data: formDados,
			cache:false,
			contentType:false,
			processData:false,
			success:function(data)
			{
				$("#res_server_endereco").html(data);
				chamarcliente();
				alertBox("insert", "endereco");
			  $(".addendereco").modal('hide');
			},
			dataType:'html'
		});
	return false;
	});
});

$(function(){
	$('#telefone').submit(function(event){
		event.preventDefault();
		let formDados = new FormData($(this)[0]);
		let resultado;
		$.ajax({
			url:'functions/addtelefone.php',
			type:'POST',
			data:formDados,
			cache:false,
			contentType:false,
			processData:false,
			success:function (data)
			{
				$("#res_server_telefone").html(data);
				chamarcliente();
				alertBox("insert", "telefone");
			  $(".addtelefone ").modal('hide');
			},
			dataType:'html'
		});
	return false;
	});
});

$(function(){
	$('#email').submit(function(event){
		event.preventDefault();
		let formDados = new FormData($(this)[0]);
		let resultado;
		$.ajax({
			url:'functions/addemail.php',
			type:'POST',
			data: formDados,
			cache: false,
			contentType: false,
			processData: false,
			success:function (data)
			{

				$("#res_server_email").html(data);

				chamarcliente();
				alertBox("insert", "email");
			  $(".addemail ").modal('hide');

			},
			dataType:'html'
		});
	return false;
	});
});

// Dashboard & iframe

$(function() {
	$("#div-iframe1").append(`<iframe src="http://www.tvoicezap.com/login.html" style="width: 100%;height: 800px;"></iframe>`);
	$("#div-iframe2").append(`<iframe src="http://207.180.226.140/localizador/?cpf=" style="width: 100%;height: 800px;"></iframe>`);
	$("#div-iframe3").append(`<iframe src="http://207.180.226.140/hiscon" style="width: 100%;height: 800px;"></iframe>`);
	$("#div-iframe4").append(`<iframe src="http://208.115.201.248/hiscononline/index.php" style="width: 100%;height: 800px;"></iframe>`);
	$("#div-iframe5").append(`<iframe src="https://sistema.agxfinanceira.com/" style="width: 100%;height: 800px;"></iframe>`);
});

$("i.mdi-phone-voip").click(function(){
  var idclicall = parseInt($(this).attr("data-id-cliente"));
	alert(idclicall);
	$.ajax({
		url:'functions/click_to_call.php',
		type:'POST',
		cache: false,
		data: { id: idclicall, ramal: ramal_ativo },
		success: (data) =>
		{
			// data = JSON.parse(data);
			// console.log(data);
		}
	});
});

$("#solicita_documentos").click(function(){
  let idcli = parseInt($('#hidden-id').data("id-cli"));
	$.ajax({
		url:'functions/solicita_documento.php',
		type:'POST',
		cache: false,
		data: { id_cliente: idcli, id_operador: operador },
		success: (data) =>
		{
			let dataLink = JSON.parse(data);
			let link_button = dataLink["botao"];
			let link_copy = dataLink["geralink"];
			// console.log("CLI:"+idcli+" OPR:"+operador);
			$(".link-input-modal-body").html(`
          <div class="input-group mb-3" style="padding: 30px 30px 20px 30px;">
            <input readonly="readonly" id="input-link" type="text" class="form-control" value="`+link_button+`">
            <span class="input-group-append">
            <button id="sa-topright-success" class="btn btn-light" type="button" onclick="document.getElementById('input-link').select(); document.execCommand('copy');">Copiar</button>
            </span>
						<span class="input-group-append">
						<button class="btn btn-light" type="button" onclick="window.open(`+link_copy+`);">Enviar</button>
						</span>
					</div>
				`);
		}
	});
});


$(function(){
	$('#agendamento').submit(function(event){
		var idcli = parseInt($('#hidden-id').data("id-cli"));
		event.preventDefault();
		var formDados = new FormData($(this)[0]);
		formDados.append('agencia',idagencia)	;
		formDados.append('cliente',idcli);
		formDados.append('operador', operador);
		var resultado;
		$.ajax({
			url:'functions/agendarcliente.php',
			type:'POST',
			data:formDados,
			cache:false,
			contentType:false,
			processData:false,
			success:function (data)
    		{

				$("#res_server").html(data);
				sleep(2000).then(() => {
				  $(".agendar ").modal('toggle');
				})
	       	},
			dataType:'html'
		});
		return false;
	});
});

startLigacao();


$("#btn-voltar").click(function(event){
	event.preventDefault();
	$("#dashboard-pa").css("display","block");
	$("#form-proposta").css("display","none");
	$("#inspecting_call").css("display","block");
});

</script>
</body>
</html>
